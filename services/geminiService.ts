import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
// FIX: UserProgress and PhoneticProfile are exported from types.ts, not store/userProgress.ts.
import { Level, VibeCheckContent, Goal, DetailedAssessmentResult, DetailedFeedback, SpokenResponseAnalysis, AssessmentText, LearningPath, PathModule, Exercise, ExerciseType, TargetedScript, FeatureAnalysis, UserProgress, PhoneticProfile as UserProgressPhoneticProfile } from '../types';
import { LEVEL_DEFINITIONS } from "../data/levels";

const SHARED_CORE_INSTRUCTIONS = `You are 'The American Cultural Insider,' a coach specializing in the transition from Mexican-Spanish logic to PURE American 'Insider' English (Casual and Slang).
CRITICAL CONSTRAINTS:
1. **NO British English:** Absolutely never use Britishisms (e.g., 'mate', 'cheers', 'lorry', 'innit', 'bloody'). If you use these, you fail.
2. **PURE American Vibe:** Use General American, West Coast, or common Southern casual registers.
3. **Subconscious Mapping:** Map Mexican-Spanish intents (e.g., 'Me regala', 'Que le iba a decir', 'Mande', '¿Cómo cree?') directly to their American 'Insider' shortcuts (e.g., 'Lemme grab', 'So anyway', 'What's that?', 'No way/For real?').
4. **Break the 'Textbook' Shell:** Intermediate speakers are often over-polite and stiff. Push them into the 'relaxed' zone where reductions (gonna, wanna) and slang feel natural.
5. **L1 Interference Detection:** Listen for Mexican-specific phonetic habits (s-cluster 'e', lack of aspiration, vowel mergers).
6. **CASUAL ONLY:** Never use formal, academic, or "tongue-twister" sentences (e.g., NO "Better butter makes better batter"). Use real, casual, everyday American sentences that an "Insider" would actually say in a coffee shop, at work, or with friends.
You have NATIVE MULTIMODAL capabilities. You listen to the audio signal for confidence, rhythm, and acoustic accuracy.`;

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

export const assessUserLevelComprehensive = async (
  audioBlobs: Blob[],
  goal: Goal,
  assessmentTexts: AssessmentText[]
): Promise<DetailedAssessmentResult> => {
  const ai = getAi();
  const audioParts = await Promise.all(audioBlobs.map(fileToGenerativePart));

  const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}

You are an expert American English pronunciation diagnostician with a PhD in phonetics. You analyze speech patterns with clinical precision.

Your analysis must be:
- Specific (use IPA when relevant)
- Actionable (identify exactly what needs to change)
- Encouraging (celebrate strengths, frame weaknesses as opportunities)

The user wants to achieve: ${goal === Goal.CASUAL ? 'clear, natural American speech' : 'fluent American speech with slang mastery'}.

IMPORTANT: Since you specialize in the transition from Mexican-Spanish logic to PURE American English, you should recommend the 'SPANISH_TO_INSIDER' path by default for users showing typical Spanish L1 interference (e.g., s-cluster 'e', vowel merging, flat intonation, or over-polite 'textbook' phrasing). Only recommend other paths if their specific needs (like only rhythm or only slang) are much more prominent.`;

  const prompt = `Analyze these ${audioBlobs.length} recordings as a comprehensive pronunciation assessment.

For each recording, the user read:
${assessmentTexts.map((t, i) => `Recording ${i + 1} (for assessing '${t.id}'): "${t.text}"\nTargets: ${t.targets.map(tgt => tgt.sound).join(', ')}`).join('\n\n')}

Here are the detailed definitions for the proficiency levels. Use these criteria to determine the user's 'overallLevel' (1-10) and 'levelName'.
${JSON.stringify(LEVEL_DEFINITIONS, null, 2)}

Based on your analysis of the audio against the phonetic targets AND the level definitions provided, return a JSON object with this exact structure. For each feature in the phoneticProfile, you MUST provide a score, feedback, and priority. The 'trend' MUST be 'stable' and the 'history' array MUST contain the single score you assigned.

Example of a phoneticProfile entry:
"flapT": { 
  "score": 7, 
  "feedback": "Good use of the flap T in 'butter', but it was a hard T in 'better'.", 
  "priority": "high",
  "trend": "stable",
  "history": [7]
}`;

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
          model: 'gemini-3-pro-preview',
          contents,
          config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
          }
      });
      const jsonText = response?.text || '{}';
      const result = JSON.parse(jsonText);
      return { ...result, goal };
  } catch (error) {
      console.error("Error assessing user level:", error);
      throw new Error("Failed to assess user level due to an API error.");
  }
};

// Enhanced generateSocialScript
const getWeakAreas = (profile: UserProgressPhoneticProfile): string[] => {
    const weakAreas: { name: string, score: number }[] = [];
    const threshold = 7; // Defines a "weak area"

    (Object.keys(profile) as Array<keyof UserProgressPhoneticProfile>).forEach(key => {
      if (profile[key].score < threshold) {
        // A bit of formatting for the prompt
        const name = (key as string).replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        weakAreas.push({ name, score: profile[key].score });
      }
    });

    // Sort by lowest score to prioritize the weakest areas first
    weakAreas.sort((a, b) => a.score - b.score);

    return weakAreas.map(area => area.name).slice(0, 3); // Return top 3 weakest areas
};

export const generateExercise = async (userProgress: UserProgress, module: PathModule): Promise<Exercise> => {
    const ai = getAi();
    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}

You are an expert curriculum designer for American English learners. Your tone is energetic and encouraging. You create specific, targeted exercises in a structured JSON format.`;

    const weakAreas = getWeakAreas(userProgress.phoneticProfile);
    const level = userProgress.currentLevelName;

    const prompt = `Generate a single, complete exercise object for a language learner at the '${level}' level.

The current learning module is "${module.name}".
The module's objectives are:
- ${module.objectives.join('\n- ')}

User's specific weak areas to target (if any):
- ${weakAreas.length > 0 ? weakAreas.join('\n- ') : 'None specified, focus on module objectives.'}

Your task is to create a JSON exercise object.
1.  First, you MUST choose one exercise type from this list of allowed types for this module: [${module.exercises.join(', ')}].
2.  Then, create the full exercise JSON object.
3.  The 'content.text' MUST be a very short, casual text (one or two natural sentences) that is specifically designed to help the user practice the module's objectives and ideally their weak areas. AVOID tongue-twisters or formal academic language.
4.  Provide 1-2 concise and highly practical 'content.tips' for the user.
5.  Set the 'difficulty' to 1 for Tourist, 2 for Local, or 3 for Insider level.
6.  The response MUST be a single JSON object matching the provided schema.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: Object.values(ExerciseType) },
        content: {
          type: Type.OBJECT,
          properties: {
            audioUrl: { type: Type.STRING },
            text: { type: Type.STRING },
            breakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            modelPronunciation: { type: Type.STRING }
          },
          required: ['text']
        },
        targetSounds: { type: Type.ARRAY, items: { type: Type.STRING } },
        difficulty: { type: Type.INTEGER }
      },
      required: ['type', 'content', 'difficulty']
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
        const jsonText = response?.text || '{}';
        const exercise = JSON.parse(jsonText) as Exercise;
        
        // Extract audio from response
        const audioPart = response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (audioPart?.inlineData?.data && exercise.content) {
            exercise.content.modelPronunciation = audioPart.inlineData.data;
            exercise.content.modelPronunciationMimeType = audioPart.inlineData.mimeType;
        }

        // Generate model pronunciation using dedicated TTS model for better quality and compatibility
        // This ensures we get a standard format that browsers can play easily
        if (exercise.content?.text) {
            try {
                const ttsAudio = await generateTTSAudio(exercise.content.text);
                if (exercise.content) {
                    exercise.content.modelPronunciation = ttsAudio;
                    exercise.content.modelPronunciationMimeType = 'audio/mpeg';
                }
            } catch (error) {
                console.error("Failed to generate TTS audio, using multimodal output if available:", error);
            }
        }
        
        return exercise;
    } catch (error) {
        console.error("Error generating exercise:", error);
        return {
            type: ExerciseType.LISTEN_REPEAT,
            content: {
                text: "Sorry, we couldn't create an exercise. Let's try this: 'What's up?'",
                tips: ["Try to make it sound friendly!"]
            },
            difficulty: 1
        };
    }
};

export const generateTTSAudio = async (text: string): Promise<string> => {
    const ai = getAi();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A friendly, clear voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from TTS API");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating TTS audio:", error);
        throw new Error("Failed to generate audio for the exercise.");
    }
};

export const analyzeAudioDetailed = async (
  script: string,
  audioBlob: Blob,
  targetFeatures: string[],
  userLevel: Level,
  previousAttempts: Blob[] = []
): Promise<DetailedFeedback> => {
  const ai = getAi();
  const audioPart = await fileToGenerativePart(audioBlob);
  const previousParts = await Promise.all(previousAttempts.map(fileToGenerativePart));

  const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}

You are a world-class American English pronunciation coach with expertise in:
- Phonetics and phonology (you use IPA when helpful, like [ɡʌnə] for 'gonna')
- Second language acquisition principles
- Providing encouraging, highly actionable feedback

The user is at the **${userLevel}** level. You MUST adjust your feedback's depth and complexity accordingly.
- **Tourist**: Be very encouraging. Focus on ONE major thing at a time. Keep it simple.
- **Local**: You can introduce more technical terms (e.g., 'flap t', 'vowel reduction'). Give 2-3 key points.
- **Insider**: Assume high motivation. Provide nuanced, subtle corrections on flow, intonation, and cultural appropriateness.

A core part of your feedback is the **"How it looks" vs "How it sounds"** format for reductions and connected speech. You must use this where relevant.
Example: How it looks: "going to" → How it sounds: "gonna" [ɡʌnə]`;

  const prompt = `Analyze the user's audio recording of the following script:
**Script:** "${script}"

The primary **target features** for this exercise are: ${targetFeatures.join(', ')}. Please focus your analysis on these features above all else.

There are ${previousAttempts.length} previous attempts provided for context. Compare the current attempt to these to track progress in rhythm and timing.

Your response MUST be a single JSON object that strictly follows this schema. Provide scores from 1 (needs a lot of work) to 10 (native-like).`;

  const scoredFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
        timing: { type: Type.STRING },
    },
    required: ['score', 'feedback'],
  };

  const featureAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        feature: { type: Type.STRING },
        score: { type: Type.INTEGER },
        heard: { type: Type.STRING, description: "What you actually heard the user say, with IPA if helpful." },
        target: { type: Type.STRING, description: "What the target pronunciation should be, with IPA if helpful." },
        howItLooks: { type: Type.STRING, description: "The written-out words." },
        howItSounds: { type: Type.STRING, description: "How the words sound in natural, connected speech." },
        tip: { type: Type.STRING, description: "A single, actionable tip to help the user improve this specific feature." },
    },
    required: ['feature', 'score', 'heard', 'target', 'howItLooks', 'howItSounds', 'tip'],
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER },
        targetFeaturesAnalysis: { type: Type.ARRAY, items: featureAnalysisSchema },
        rhythm: scoredFeedbackSchema,
        clarity: scoredFeedbackSchema,
        naturalness: scoredFeedbackSchema,
        timingAlignment: scoredFeedbackSchema,
        celebration: { type: Type.STRING, description: "Start with a positive! What is one specific thing they did well?" },
        oneThingToFix: { type: Type.STRING, description: "What is the single most impactful thing they should focus on next?" },
        practiceRecommendation: { type: Type.STRING, description: "Suggest a concrete micro-exercise to work on the 'oneThingToFix'." },
    },
    required: ['overallScore', 'targetFeaturesAnalysis', 'rhythm', 'clarity', 'naturalness', 'timingAlignment', 'celebration', 'oneThingToFix', 'practiceRecommendation'],
  };

  const contents = {
      parts: [...previousParts, audioPart, { text: prompt }],
  };

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents,
          config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
          }
      });
      const jsonText = response?.text || '{}';
      const parsed = JSON.parse(jsonText);
      
      // Ensure the structure is valid even if AI missed some fields
      return {
          overallScore: parsed.overallScore || 0,
          targetFeaturesAnalysis: parsed.targetFeaturesAnalysis || [],
          rhythm: parsed.rhythm || { score: 0, feedback: "No rhythm feedback available." },
          clarity: parsed.clarity || { score: 0, feedback: "No clarity feedback available." },
          naturalness: parsed.naturalness || { score: 0, feedback: "No naturalness feedback available." },
          timingAlignment: parsed.timingAlignment || { score: 0, feedback: "No timing feedback available." },
          celebration: parsed.celebration || "Great effort!",
          oneThingToFix: parsed.oneThingToFix || "Keep practicing your pronunciation.",
          practiceRecommendation: parsed.practiceRecommendation || "Try recording again to improve.",
      } as DetailedFeedback;
  } catch (error) {
      console.error("Error analyzing audio with detailed feedback:", error);
      // Provide a structured fallback error
      return {
          overallScore: 0,
          targetFeaturesAnalysis: [],
          rhythm: { score: 0, feedback: "Analysis failed." },
          clarity: { score: 0, feedback: "Analysis failed." },
          naturalness: { score: 0, feedback: "Analysis failed." },
          timingAlignment: { score: 0, feedback: "Analysis failed." },
          celebration: "You tried, and that's what counts! Let's try again.",
          oneThingToFix: "There was an error analyzing the audio. Please ensure you're in a quiet place.",
          practiceRecommendation: "Try recording the exercise again.",
      };
  }
};

export const generateVibeCheck = async (script: string): Promise<VibeCheckContent> => {
    const ai = getAi();
    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}

You are 'The American Cultural Insider.' Your goal is to test a user's comprehension of nuance and slang from a text they just read, and to explain the slang.`;
    const prompt = `Based on this text: "${script}", generate a JSON object. This object must have three keys: 'slangBreakdown', 'questions', and 'challenge'. 'slangBreakdown' must be an array of objects, where each object has a 'term' (the slang word or phrasal verb from the text) and a 'meaning' (a clear, simple explanation). 'questions' must be an array of two strings, each a question about the underlying meaning or nuance (e.g., sarcasm, word choice) for the user to think about. 'challenge' must be a string prompting the user to use one of the slang words in a spoken sentence about their own life.`;

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
                                }
                            }
                        },
                        questions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        challenge: {
                            type: Type.STRING
                        }
                    }
                }
            }
        });
        const jsonText = response?.text || '{}';
        return JSON.parse(jsonText) as VibeCheckContent;
    } catch (error) {
        console.error("Error generating vibe check:", error);
        return {
            slangBreakdown: [{ term: "N/A", meaning: "Could not generate slang breakdown."}],
            questions: ["Could not generate a question. What do you think the main feeling of the text was?", "What's one word you learned?"],
            challenge: "Try using a word from the text in a sentence!"
        };
    }
};

export const analyzeSpokenResponse = async (challenge: string, audioBlob: Blob): Promise<SpokenResponseAnalysis> => {
    const ai = getAi();
    const audioPart = await fileToGenerativePart(audioBlob);

    const systemInstruction = "You are an American English coach. You are analyzing a user's spoken response to a challenge question. Your feedback should be encouraging and focus on clarity and correct use of slang.";
    const prompt = `The challenge was: "${challenge}". The user responded with this audio. Please analyze their response for clarity, confidence, and correct use of any target slang. Provide a score from 1-100 and brief, encouraging feedback. Return a JSON object with 'score' (integer) and 'feedback' (string) keys.`;

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
                    }
                }
            }
        });
        const jsonText = response?.text || '{}';
        return JSON.parse(jsonText) as SpokenResponseAnalysis;
    } catch (error) {
        console.error("Error analyzing spoken response:", error);
        return {
            score: 0,
            feedback: "There was an issue analyzing your spoken response. Please try recording again.",
        };
    }
};

export const generateStrategicInsights = async (userProgress: UserProgress): Promise<string[]> => {
    const ai = getAi();
    
    const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}\n\nAnalyze user progress to identify 'Hidden Habits' based on Mexican-Spanish L1 interference. Explain the 'Why' (L1 interference) and the 'How' (The Insider way).`;
    const prompt = `Analyze this Mexican-Spanish L1 user's phonetic profile and history:
    
**Profile:**
${JSON.stringify(userProgress.phoneticProfile, null, 2)}
**Recent History:**
${JSON.stringify(userProgress.exerciseHistory.slice(-5), null, 2)}
**Task:**
Identify the underlying L1 habits (Spanish interference) or 'Textbook' behaviors holding them back.
Return 2-3 deep-dive insights.`;
    try {
        const response = await ai.models.generateContent({
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
        const jsonText = response?.text || '[]';
        return JSON.parse(jsonText) as string[];
    } catch (error) {
        console.error('Error generating strategic insights:', error);
        return [
            'Your vowels are getting clearer, but watch that e sound before s clusters.',
            'Try using gonna or wanna more often; your formal English is great, but the reductions will give you that Insider vibe.'
        ];
    }
};

export const generateTargetedScript = async (
  userProgress: UserProgress,
  currentModule: PathModule,
  difficulty: 1 | 2 | 3
): Promise<TargetedScript> => {
  const ai = getAi();

  const targetFeatures = currentModule.objectives.join(', ');
  const weakAreas = getWeakAreas(userProgress.phoneticProfile);

  const systemInstruction = `${SHARED_CORE_INSTRUCTIONS}

You are 'The American Cultural Insider', an expert curriculum designer creating hyper-personalized practice scripts for language learners.

CRITICAL REQUIREMENTS:
1. Scripts MUST contain the target features for the current module naturally. They should not feel forced or like a list of examples.
2. The script's difficulty must match the requested level (${difficulty}/3):
  - 1 (Easy): Short, simple sentences. Common vocabulary. Clear pauses.
  - 2 (Medium): More complex sentences, some idioms or phrasal verbs, natural pace.
  - 3 (Hard): Longer text, natural conversational complexity, includes slang and reductions.
3. The content MUST feel authentic to modern American culture. Think real conversations, social media posts, snippets of stories, etc.
4. The script text itself should NOT contain any emojis.
5. You must also weave in opportunities for the user to practice their specific weak areas: ${weakAreas.join(', ')}.`;

  const prompt = `Generate a targeted practice script.

- Module Objectives (Primary Focus): ${targetFeatures}
- User's Weak Areas (Secondary Focus): ${weakAreas.join(', ')}
- Difficulty: ${difficulty}/3

Return a single JSON object that strictly adheres to the provided schema.`;

    const targetInstanceSchema = {
        type: Type.OBJECT,
        properties: {
            phrase: { type: Type.STRING },
            feature: { type: Type.STRING },
            howItLooks: { type: Type.STRING },
            howItSounds: { type: Type.STRING, description: "Natural pronunciation with IPA, e.g., 'gonna [ɡʌnə]'" },
        },
        required: ['phrase', 'feature', 'howItLooks', 'howItSounds'],
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            script: { type: Type.STRING, description: "The practice text, between 50 and 100 words." },
            type: { type: Type.STRING, enum: ["dialogue", "monologue", "social_post", "story"] },
            context: { type: Type.STRING, description: "A brief (1-2 sentence) context for the script." },
            targetInstances: { type: Type.ARRAY, items: targetInstanceSchema },
            warmupPhrase: { type: Type.STRING, description: "A single, short phrase from the script to warm up with." },
            pronunciation_notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['script', 'type', 'context', 'targetInstances', 'warmupPhrase', 'pronunciation_notes'],
    };

  const contents = { parts: [{ text: prompt }] };

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-pro-preview', // A complex generation task needs a powerful model
          contents,
          config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
          }
      });
      const jsonText = response?.text || '{}';
      return JSON.parse(jsonText) as TargetedScript;
  } catch (error) {
      console.error("Error generating targeted script:", error);
      return {
          script: "I couldn't generate a script right now. Let's try this: 'What are you going to do today?' It's a great phrase for practicing connected speech.",
          type: "monologue",
          context: "A simple question to practice.",
          targetInstances: [{
              phrase: "What are you going to do",
              feature: "Connected Speech",
              howItLooks: "What are you going to do",
              howItSounds: "Whaddya gonna do [wʌɾəjə ɡʌnə du]"
          }],
          warmupPhrase: "gonna do",
          pronunciation_notes: ["Try to link the words together smoothly."]
      };
  }
};
