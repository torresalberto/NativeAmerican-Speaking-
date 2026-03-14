import { LearningPath, LearningPathDefinition, ExerciseType } from '../types';

export const LEARNING_PATHS: LearningPathDefinition[] = [
  {
    path: LearningPath.CONNECTED_SPEECH,
    name: "The Flow Master",
    forWho: "You pronounce words correctly individually, but sound robotic when speaking in sentences.",
    modules: [
      {
        id: 'cs-1',
        name: "The Holy Trinity: Gonna, Wanna, Gotta",
        description: "The three most important reductions in casual American English",
        objectives: [
          "Use 'gonna' instead of 'going to' naturally",
          "Use 'wanna' instead of 'want to' naturally",
          "Use 'gotta' instead of 'got to' / 'have to' naturally"
        ],
        exercises: [ExerciseType.LISTEN_REPEAT, ExerciseType.SHADOWING, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Reductions are automatic, not forced",
          "Rhythm stays natural",
          "Appropriate context usage"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'cs-2',
        name: "Linking: Vowel to Vowel",
        description: "How Americans connect words ending in vowels to words starting with vowels",
        objectives: [
          "Master the glide insertion (I am → I-yam)",
          "Practice the [w] insertion (go out → go-wout)",
          "Apply in natural conversation"
        ],
        exercises: [ExerciseType.MINIMAL_PAIRS, ExerciseType.SHADOWING, ExerciseType.SENTENCE_BUILD],
        assessmentCriteria: [
          "Smooth transitions between words",
          "No unnatural pauses"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'cs-3',
        name: "Linking: Consonant to Vowel",
        description: "The most common type of linking in English",
        objectives: [
          "Link final consonants to following vowels (pick up → pi-kup)",
          "Maintain meaning while linking",
          "Apply at natural speaking speed"
        ],
        exercises: [ExerciseType.SHADOWING, ExerciseType.SPEED_DRILLS, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Consistent linking",
          "Maintained intelligibility"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'cs-4',
        name: "The Power of Contractions",
        description: "Advanced contractions beyond basic I'm, you're, we're",
        objectives: [
          "Master would've, could've, should've (sounds like 'woulda', 'coulda', 'shoulda')",
          "Practice I'll've, you'll've (yes, these exist)",
          "Use negative contractions naturally"
        ],
        exercises: [ExerciseType.LISTEN_IDENTIFY, ExerciseType.SHADOWING, ExerciseType.TRANSLATION],
        assessmentCriteria: [
          "Can produce and recognize advanced contractions",
          "Appropriate register usage"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'cs-5',
        name: "Rapid Speech Decoding",
        description: "Understanding and producing fast casual speech",
        objectives: [
          "Decode 'whaddya' (what do you), 'didja' (did you), 'howzit' (how is it)",
          "Produce these naturally",
          "Maintain comprehension at native speeds"
        ],
        exercises: [ExerciseType.DICTATION, ExerciseType.SHADOWING, ExerciseType.CONVERSATION],
        assessmentCriteria: [
          "Can understand rapid speech",
          "Can produce without sounding forced"
        ],
        estimatedMinutes: 20
      }
    ]
  },
  {
    path: LearningPath.SOUND_ACCURACY,
    name: "The Sound Surgeon",
    forWho: "Specific sounds are holding you back - th, r, vowels, or the flap-t.",
    modules: [
      {
        id: 'sa-1',
        name: "The Flap-T Transformation",
        description: "The #1 marker of American English",
        objectives: [
          "Understand when /t/ becomes [ɾ] (flap)",
          "Produce the flap consistently",
          "Apply in common words: better, water, butter, letter, city"
        ],
        exercises: [ExerciseType.TONGUE_PLACEMENT, ExerciseType.MINIMAL_PAIRS, ExerciseType.SHADOWING],
        assessmentCriteria: [
          "Consistent flap in appropriate positions",
          "Natural integration in speech"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'sa-2',
        name: "TH Mastery",
        description: "The sounds that don't exist in most languages",
        objectives: [
          "Produce voiced /ð/ (this, that, the)",
          "Produce voiceless /θ/ (think, thank, thought)",
          "Distinguish between TH and T/D/S/Z"
        ],
        exercises: [ExerciseType.MIRROR_PRACTICE, ExerciseType.MINIMAL_PAIRS, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Correct tongue placement",
          "Clear distinction between voiced and voiceless"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'sa-3',
        name: "The American R",
        description: "That unique 'rhotic' sound",
        objectives: [
          "Master the bunched and retroflex R",
          "Practice R at the beginning, middle, and end of words",
          "Handle R-colored vowels (er, ar, or, ire, ear)"
        ],
        exercises: [ExerciseType.TONGUE_PLACEMENT, ExerciseType.SHADOWING, ExerciseType.WORD_LISTS],
        assessmentCriteria: [
          "Correct resonance",
          "No trilling or tapping"
        ],
        estimatedMinutes: 25
      },
      {
        id: 'sa-4',
        name: "Vowel Clarity: Front Vowels",
        description: "Distinguishing beet, bit, bait, bet, bat",
        objectives: [
          "Master the /i/ vs /ɪ/ distinction",
          "Master the /ɛ/ vs /æ/ distinction",
          "Practice in minimal pairs"
        ],
        exercises: [ExerciseType.MINIMAL_PAIRS, ExerciseType.LISTEN_IDENTIFY, ExerciseType.VOWEL_CHARTS],
        assessmentCriteria: [
          "Accurate vowel height and tension",
          "Clear distinction in minimal pairs"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'sa-5',
        name: "Vowel Clarity: Back & Mixed Vowels",
        description: "Mastering the Schwa and other tricky vowels",
        objectives: [
          "Master the Schwa /ə/ (the most common sound!)",
          "Distinguish /ɑ/ (father) vs /ɔ/ (caught) - or the lack thereof!",
          "Practice /u/ (boot) vs /ʊ/ (book)"
        ],
        exercises: [ExerciseType.SCHWA_SPOTTING, ExerciseType.SHADOWING, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Correct vowel reduction to schwa",
          "Accurate back vowel production"
        ],
        estimatedMinutes: 20
      }
    ]
  },
  {
    path: LearningPath.RHYTHM_FLOW,
    name: "The Rhythm Architect",
    forWho: "You sound clear, but your stress patterns feel 'off' or non-American.",
    modules: [
      {
        id: 'rf-1',
        name: "Word Stress Patterns",
        description: "Where the energy goes in a word",
        objectives: [
          "Identify stressed syllables in multi-syllabic words",
          "Master the 'Long-Strong' vs 'Short-Weak' contrast",
          "Understand stress shifts in related words (PHOtograph vs phoTOGraphy)"
        ],
        exercises: [ExerciseType.LISTEN_IDENTIFY, ExerciseType.BEAT_MAPPING, ExerciseType.SHADOWING],
        assessmentCriteria: [
          "Correct primary stress",
          "Appropriate vowel reduction in unstressed syllables"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'rf-2',
        name: "Sentence Stress & Focus",
        description: "Highlighting the important information",
        objectives: [
          "Identify content words vs function words",
          "Apply stress to content words",
          "Use 'Focus Stress' to change meaning"
        ],
        exercises: [ExerciseType.BEAT_MAPPING, ExerciseType.SHADOWING, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Natural sentence rhythm",
          "Clear focus on key information"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'rf-3',
        name: "Intonation: Questions & Statements",
        description: "The music of the language",
        objectives: [
          "Master rising intonation for Yes/No questions",
          "Master falling intonation for WH-questions and statements",
          "Practice 'Tag Questions' intonation"
        ],
        exercises: [ExerciseType.INTONATION_MAPPING, ExerciseType.SHADOWING, ExerciseType.ROLE_PLAY],
        assessmentCriteria: [
          "Appropriate pitch movement",
          "Natural-sounding queries"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'rf-4',
        name: "Intonation: Emotion & Attitude",
        description: "Expressing how you feel without saying it",
        objectives: [
          "Use intonation for sarcasm and irony",
          "Express surprise, doubt, or certainty",
          "Practice polite vs blunt intonation"
        ],
        exercises: [ExerciseType.ROLE_PLAY, ExerciseType.SHADOWING, ExerciseType.CONTEXT_MATCHING],
        assessmentCriteria: [
          "Accurate emotional conveyance",
          "Nuanced pitch control"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'rf-5',
        name: "The American 'Drawl' & Pace",
        description: "Mastering the overall speed and feel",
        objectives: [
          "Practice 'stretching' stressed vowels",
          "Master the use of pauses for effect",
          "Apply all rhythm features to a long monologue"
        ],
        exercises: [ExerciseType.METRONOME_PRACTICE, ExerciseType.SHADOWING, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Consistent American pacing",
          "Natural use of vowel length"
        ],
        estimatedMinutes: 25
      }
    ]
  },
  {
    path: LearningPath.VOCABULARY_SLANG,
    name: "The Slang Insider",
    forWho: "You want to understand and use the language of the streets and social media.",
    modules: [
      {
        id: 'vs-1',
        name: "Essential Daily Slang",
        description: "Words you'll hear every single day",
        objectives: [
          "Master 'What's up', 'My bad', 'No worries', 'For sure'",
          "Understand the many uses of 'Like'",
          "Use 'Cool', 'Awesome', 'Sweet' appropriately"
        ],
        exercises: [ExerciseType.CONTEXT_MATCHING, ExerciseType.DIALOGUE_PRACTICE, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Natural usage in context",
          "Correct understanding of nuance"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'vs-2',
        name: "Social Media & Gen Z Talk",
        description: "The language of the internet",
        objectives: [
          "Understand 'Bet', 'No cap', 'Sus', 'Vibe', 'Ghosted'",
          "Practice using these in digital-style contexts",
          "Identify when NOT to use this slang"
        ],
        exercises: [ExerciseType.TRANSLATION, ExerciseType.ROLE_PLAY, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Accurate usage of modern terms",
          "Understanding of social appropriateness"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'vs-3',
        name: "Phrasal Verbs in Action",
        description: "The building blocks of casual speech",
        objectives: [
          "Master 'hang out', 'check out', 'work out', 'show up'",
          "Practice separable vs inseparable phrasal verbs",
          "Replace formal verbs with phrasal verbs"
        ],
        exercises: [ExerciseType.REPLACE_FORMAL, ExerciseType.SHADOWING, ExerciseType.SENTENCE_BUILD],
        assessmentCriteria: [
          "Automatic use of phrasal verbs",
          "Correct word order"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'vs-4',
        name: "Idioms for Every Situation",
        description: "Sayings that don't mean what they say",
        objectives: [
          "Master 'Piece of cake', 'Under the weather', 'Break a leg'",
          "Understand the cultural origin of common idioms",
          "Use idioms naturally in stories"
        ],
        exercises: [ExerciseType.NATURAL_INSERTION, ExerciseType.SHADOWING, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Correct idiomatic usage",
          "Natural integration in flow"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'vs-5',
        name: "The Art of the 'Vibe Check'",
        description: "Understanding subtext and cultural references",
        objectives: [
          "Identify sarcasm and dry humor",
          "Understand common cultural references (movies, sports, memes)",
          "Practice 'reading the room' in American social settings"
        ],
        exercises: [ExerciseType.REFERENCE_MATCHING, ExerciseType.CONVERSATION, ExerciseType.ROLE_PLAY],
        assessmentCriteria: [
          "Can identify subtext",
          "Appropriate cultural responses"
        ],
        estimatedMinutes: 25
      }
    ]
  }
];
