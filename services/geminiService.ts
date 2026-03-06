
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
// FIX: UserProgress and PhoneticProfile are exported from types.ts, not store/userProgress.ts.
import { Level, VibeCheckContent, Goal, DetailedAssessmentResult, DetailedFeedback, SpokenResponseAnalysis, AssessmentText, LearningPath, PathModule, Exercise, ExerciseType, TargetedScript, FeatureAnalysis, UserProgress, PhoneticProfile as UserProgressPhoneticProfile } from '../types';
import { LEVEL_DEFINITIONS } from "../data/levels";

const getAi = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
}

const fileToGenerativePart = async (file: Blob) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

const SHARED_CORE_INSTRUCTIONS = `You are 'The American Cultural Insider,' a coach specializing in the transition from Mexican-Spanish logic to PURE American "Insider" English (Casual and Slang).

CRITICAL CONSTRAINTS:
1. **NO British English:** Absolutely never use Britishisms (e.g., 'mate', 'cheers', 'lorry', 'innit', 'bloody'). If you use these, you fail.
2. **PURE American Vibe:** Use General American, West Coast, or common Southern casual registers.
3. **Subconscious Mapping:** Map Mexican-Spanish intents (e.g., 'Me regala', 'Que le iba a decir', 'Mande', '¿Cómo cree?') directly to their American "Insider" shortcuts (e.g., 'Lemme grab', 'So anyway', 'What's that?', 'No way/For real?').
4. **Break the "Textbook" Shell:** Intermediate speakers are often over-polite and stiff. Push them into the "relaxed" zone where reductions (gonna, wanna) and slang feel natural.
5. **L1 Interference Detection:** Listen for Mexican-specific phonetic habits (s-cluster 'e', lack of aspiration, vowel mergers).

You have NATIVE MULTIMODAL capabilities. You listen to the audio signal for confidence, rhythm, and acoustic accuracy.`;

export const assessUserLevelComprehensive = async (
  audioBlobs: Blob[],
  goal: Goal,
  assessmentTexts: AssessmentText[]
): Promise<DetailedAssessmentResult> => {
  const ai = getAi();
  const audioParts = await Promise.all(audioBlobs.map(fileToGenerativePart));
  
  const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nYour task is to analyze diagnostic recordings to build a "Phonetic & Cultural Profile." Identify if the user is translating Mexican-Spanish politeness logic literally into English.`;

  const prompt = `Perform a multimodal assessment on these ${audioBlobs.length} recordings. 
${assessmentTexts.map((t, i) => `Recording ${i + 1}: "${t.text}" (Assessing: ${t.id})`).join('\n')}

Identify "Vibe Killers" (Mexican phonetic habits) and "Textbook Traps" (Formalism). 
Return a JSON object. In the 'feedback', provide specific advice on moving from Mexican thinking to American Insider speaking.`;

  const featureScoreSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
        priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
        trend: { type: Type.STRING, enum: ['improving', 'stable', 'needs_work'] },
        history: { type: Type.ARRAY, items: { type: Type.INTEGER } },
    },
    required: ['score', 'feedback', 'priority', 'trend', 'history'],
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallLevel: { type: Type.INTEGER },
        levelName: { type: Type.STRING, enum: [Level.TOURIST, Level.LOCAL, Level.INSIDER] },
        phoneticProfile: {
            type: Type.OBJECT,
            properties: {
                flapT: featureScoreSchema,
                connectedSpeech: featureScoreSchema,
                thSounds: featureScoreSchema,
                vowelQuality: featureScoreSchema,
                rhythmStress: featureScoreSchema,
                rSound: featureScoreSchema,
                intonation: featureScoreSchema,
            },
            required: ['flapT', 'connectedSpeech', 'thSounds', 'vowelQuality', 'rhythmStress', 'rSound', 'intonation'],
        },
        topStrength: { type: Type.STRING },
        primaryFocus: { type: Type.STRING },
        secondaryFocus: { type: Type.STRING },
        recommendedPath: { type: Type.STRING, enum: Object.values(LearningPath) },
        encouragement: { type: Type.STRING },
    },
     required: ['overallLevel', 'levelName', 'phoneticProfile', 'topStrength', 'primaryFocus', 'secondaryFocus', 'recommendedPath', 'encouragement'],
  };

  const contents = {
      parts: [...audioParts, { text: prompt }],
  };

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents,
          config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
          }
      });
      const jsonText = response.text || '{}';
      const result = JSON.parse(jsonText);
      return { ...result, goal };
  } catch (error) {
      console.error("Error assessing user level:", error);
      throw new Error("Failed to assess user level due to an API error.");
  }
};

export const generateExercise = async (userProgress: UserProgress, module: PathModule): Promise<Exercise> => {
    const ai = getAi();
    const level = userProgress.currentLevelName;
    const weakAreas = getWeakAreas(userProgress.phoneticProfile);
    
    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nYour task is to generate a "Subconscious Bridge" exercise. Pick a common Mexican-Spanish intent and map it to an American Insider shortcut.`;
    
    const prompt = `Generate a personalized "Subconscious Bridge" exercise for a learner with these weak areas: ${weakAreas.join(', ')}.
**Module:** "${module.name}"
**Objectives:** ${module.objectives.join(', ')}

Create 1-2 sentences of "Insider" English that replaces a common formal habit. Force the user to practice their weak phonetic areas.
Return JSON + native AUDIO.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: Object.values(ExerciseType) },
        content: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        },
        targetSounds: { type: Type.ARRAY, items: { type: Type.STRING } },
        difficulty: { type: Type.INTEGER }
      },
      required: ['type', 'content', 'targetSounds', 'difficulty']
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema,
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }
                    }
                }
            },
        });
        
        const jsonText = response.text || '{}';
        const exerciseData = JSON.parse(jsonText);
        
        const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        const modelPronunciation = audioPart?.inlineData?.data;

        return {
            ...exerciseData,
            content: {
                ...exerciseData.content,
                modelPronunciation
            }
        } as Exercise;

    } catch (error) {
        console.error("Error generating Subconscious Bridge exercise:", error);
        return {
            type: ExerciseType.LISTEN_REPEAT,
            content: {
                text: "Wanna grab a coffee later?",
                tips: ["Don't overthink the grammar—'Wanna' is your best friend here.", "Watch that 's' in 'later' (just kidding, watch the 't' in 'later')."]
            },
            difficulty: 1
        };
    }
};

export const generateTTSAudio = async (text: string): Promise<string> => {
    const ai = getAi();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts: [{ text: `Generate a clear, natural American English audio recording of this text: "${text}"` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from Gemini Audio API");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating audio:", error);
        throw new Error("Failed to generate audio for the exercise.");
    }
};

export const analyzeAudioDetailed = async (
  script: string,
  audioBlob: Blob,
  targetFeatures: string[],
  userLevel: Level,
  previousAttempts: Blob[] = [] // New: Session history
): Promise<DetailedFeedback> => {
  const ai = getAi();
  
  // Convert current and previous audio to generative parts
  const currentAudioPart = await fileToGenerativePart(audioBlob);
  const previousAudioParts = await Promise.all(previousAttempts.slice(-2).map(fileToGenerativePart)); // Last 2 attempts for context
  
  const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nAnalyze the user's current attempt. Flag any "Mexican Politeness" carry-over or "Textbook Hangover" that breaks the Insider vibe. Compare to previous attempts if provided.`;

  const prompt = `**Target Script:** "${script}"
**Target Features:** ${targetFeatures.join(', ')}

Analyze the audio for "Vibe Killers" (L1 habits) and comparative progress. Provide a JSON response including 'timingAlignment' analysis.`;

  const contents = {
      parts: [
          ...previousAudioParts.map((p, i) => ({ text: `Previous Attempt ${i + 1}:` })),
          ...previousAudioParts,
          { text: "Current Recording:" },
          currentAudioPart,
          { text: prompt }
      ],
  };

  const scoredFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
    },
    required: ['score', 'feedback'],
  };

  const featureAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        feature: { type: Type.STRING },
        score: { type: Type.INTEGER },
        heard: { type: Type.STRING },
        target: { type: Type.STRING },
        howItLooks: { type: Type.STRING },
        howItSounds: { type: Type.STRING },
        timing: { type: Type.STRING }, // Optional: Specific timing feedback
        tip: { type: Type.STRING },
    },
    required: ['feature', 'score', 'heard', 'target', 'howItLooks', 'howItSounds', 'tip'],
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER },
        targetFeaturesAnalysis: { type: Type.ARRAY, items: featureAnalysisSchema },
        rhythm: scoredFeedbackSchema,
        timingAlignment: scoredFeedbackSchema, // New: Rhythmic timing
        clarity: scoredFeedbackSchema,
        naturalness: scoredFeedbackSchema,
        celebration: { type: Type.STRING },
        oneThingToFix: { type: Type.STRING },
        practiceRecommendation: { type: Type.STRING },
    },
    required: ['overallScore', 'targetFeaturesAnalysis', 'rhythm', 'timingAlignment', 'clarity', 'naturalness', 'celebration', 'oneThingToFix', 'practiceRecommendation'],
  };

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents,
          config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
          }
      });
      const jsonText = response.text || '{}';
      return JSON.parse(jsonText) as DetailedFeedback;
  } catch (error) {
      console.error("Error analyzing audio with detailed feedback:", error);
      // Provide a structured fallback error
      return {
          overallScore: 0,
          targetFeaturesAnalysis: [],
          rhythm: { score: 0, feedback: "Analysis failed." },
          clarity: { score: 0, feedback: "Analysis failed." },
          naturalness: { score: 0, feedback: "Analysis failed." },
          celebration: "You tried, and that's what counts! Let's try again.",
          oneThingToFix: "There was an error analyzing the audio. Please ensure you're in a quiet place.",
          practiceRecommendation: "Try recording the exercise again.",
      };
  }
};

export const generateStrategicInsights = async (userProgress: UserProgress): Promise<string[]> => {
    const ai = getAi();
    
    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nAnalyze user progress to identify "Hidden Habits" based on Mexican-Spanish L1 interference. Explain the 'Why' (L1 interference) and the 'How' (The Insider way).`;

    const prompt = `Analyze this Mexican-Spanish L1 user's phonetic profile and history:
    
**Profile:**
${JSON.stringify(userProgress.phoneticProfile, null, 2)}

**Recent History:**
${JSON.stringify(userProgress.exerciseHistory.slice(-5), null, 2)}

**Task:**
Identify the underlying L1 habits (Spanish interference) or "Textbook" behaviors holding them back.
Return 2-3 deep-dive insights.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const jsonText = response.text || '[]';
        return JSON.parse(jsonText) as string[];
    } catch (error) {
        console.error("Error generating strategic insights:", error);
        return [
            "Your vowels are getting clearer, but watch that 'e' sound before 's' clusters.",
            "Try using 'gonna' or 'wanna' more often; your formal English is great, but the reductions will give you that 'Insider' vibe."
        ];
    }
};

export const generateVibeCheck = async (script: string): Promise<VibeCheckContent> => {
    const ai = getAi();
    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nHelp the user bridge Mexican social logic to American casual slang. Explain WHY the "Insider" word replaces the formal one.`;

    const prompt = `Based on this text: "${script}", generate a JSON vibe check.
- 'slangBreakdown': term and the "Insider" reason/meaning.
- 'questions': 2 nuanced questions about the vibe.
- 'challenge': A prompt to use the slang in a way that breaks a common formal habit.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slangBreakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    term: { type: Type.STRING },
                                    meaning: { type: Type.STRING }
                                },
                                required: ['term', 'meaning']
                            }
                        },
                        questions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        challenge: {
                            type: Type.STRING
                        }
                    },
                    required: ['slangBreakdown', 'questions', 'challenge']
                }
            }
        });
        const jsonText = response.text || '{}';
        return JSON.parse(jsonText) as VibeCheckContent;
    } catch (error) {
        console.error("Error generating vibe check:", error);
        return {
            slangBreakdown: [{ term: "Gonna", meaning: "The bread and butter of casual American English. Replaces the stiff 'going to'."}],
            questions: ["How does using 'gonna' change the feeling of the request?", "Why is being 'too polite' sometimes a vibe killer?"],
            challenge: "Try telling me what you're 'gonna' do this weekend without being formal."
        };
    }
};

export const analyzeSpokenResponse = async (challenge: string, audioBlob: Blob): Promise<SpokenResponseAnalysis> => {
    const ai = getAi();
    const audioPart = await fileToGenerativePart(audioBlob);

    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nAnalyze the "Insider Vibe" of a Mexican-Spanish speaker's response. Look for the "Textbook Hangover" and L1 interference.`;

    const prompt = `Challenge: "${challenge}". 
Analyze the audio. Score the "Insider Vibe." 
Did they sound like a local or a textbook? Call out any L1-driven habits.`;
    
    const contents = {
        parts: [
            audioPart,
            { text: prompt }
        ]
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        feedback: { type: Type.STRING }
                    },
                    required: ['score', 'feedback']
                }
            }
        });
        const jsonText = response.text || '{}';
        return JSON.parse(jsonText) as SpokenResponseAnalysis;
    } catch (error) {
        console.error("Error analyzing spoken response:", error);
        return {
            score: 0,
            feedback: "There was an issue performing the vibe check. Keep it casual and try again!",
        };
    }
};

// Enhanced generateTargetedScript
const getWeakAreas = (profile: UserProgressPhoneticProfile): string[] => {
    const weakAreas: { name: string, score: number }[] = [];
    const threshold = 7; // Defines a "weak area"

    (Object.keys(profile) as Array<keyof UserProgressPhoneticProfile>).forEach(key => {
      if (profile[key].score < threshold) {
        const name = (key as string).replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        weakAreas.push({ name, score: profile[key].score });
      }
    });

    weakAreas.sort((a, b) => a.score - b.score);

    return weakAreas.map(area => area.name).slice(0, 3);
};

export const generateTargetedScript = async (
  userProgress: UserProgress,
  currentModule: PathModule,
  difficulty: 1 | 2 | 3
): Promise<TargetedScript> => {
  const ai = getAi();
  
  const targetFeatures = currentModule.objectives.join(', ');
  const weakAreas = getWeakAreas(userProgress.phoneticProfile);
  
  const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nCreate an "Insider" script that contrasts Mexican-Spanish intents with American shortcuts. No textbook grammar allowed. Force the use of weak areas: ${weakAreas.join(', ')}.`;

  const prompt = `Generate an "Insider" practice script for a Mexican-Spanish L1 user.
- Module Focus: ${targetFeatures}
- Target Weak Areas: ${weakAreas.join(', ')}

The script should be a natural monologue or dialogue that replaces a stiff formal situation with a real-world casual one.`;

    const targetInstanceSchema = {
        type: Type.OBJECT,
        properties: {
            phrase: { type: Type.STRING },
            feature: { type: Type.STRING },
            howItLooks: { type: Type.STRING },
            howItSounds: { type: Type.STRING },
        },
        required: ['phrase', 'feature', 'howItLooks', 'howItSounds'],
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            script: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["dialogue", "monologue", "social_post", "story"] },
            context: { type: Type.STRING },
            targetInstances: { type: Type.ARRAY, items: targetInstanceSchema },
            warmupPhrase: { type: Type.STRING },
            pronunciation_notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['script', 'type', 'context', 'targetInstances', 'warmupPhrase', 'pronunciation_notes'],
    };
  
  const contents = { parts: [{ text: prompt }] };

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview', 
          contents,
          config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
          }
      });
      const jsonText = response.text || '{}';
      return JSON.parse(jsonText) as TargetedScript;
  } catch (error) {
      console.error("Error generating targeted script:", error);
      return {
          script: "What are you going to do today?",
          type: "monologue",
          context: "A simple question.",
          targetInstances: [{
              phrase: "What are you going to do",
              feature: "Connected Speech",
              howItLooks: "What are you going to do",
              howItSounds: "Whaddya gonna do"
          }],
          warmupPhrase: "gonna do",
          pronunciation_notes: ["Keep it smooth."]
      };
  }
};
