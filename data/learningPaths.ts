
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
          "Produce voiceless /θ/ (think, thank, thing)",
          "Distinguish from /t/, /d/, /s/, /z/"
        ],
        exercises: [ExerciseType.MIRROR_PRACTICE, ExerciseType.MINIMAL_PAIRS, ExerciseType.TONGUE_TWISTERS],
        assessmentCriteria: [
          "Clear TH production",
          "No substitution errors"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'sa-3',
        name: "The American R",
        description: "The retroflex/bunched R that defines American speech",
        objectives: [
          "Understand tongue position for American R",
          "Produce R in initial position (red, right)",
          "Produce R in final position (car, far)",
          "Produce R-colored vowels (bird, work, world)"
        ],
        exercises: [ExerciseType.TONGUE_PLACEMENT, ExerciseType.SHADOWING, ExerciseType.WORD_LISTS],
        assessmentCriteria: [
          "Consistent American R quality",
          "R-colored vowels are present"
        ],
        estimatedMinutes: 25
      },
      {
        id: 'sa-4',
        name: "Vowel Boot Camp",
        description: "American vowels are different - let's fix them",
        objectives: [
          "Master the /æ/ in 'cat' (not /a/ or /e/)",
          "Master the schwa /ə/ in unstressed syllables",
          "Distinguish /ɪ/ (bit) from /i:/ (beat)",
          "Produce the American /ɑ/ (hot, not British 'hot')"
        ],
        exercises: [ExerciseType.MINIMAL_PAIRS, ExerciseType.VOWEL_CHARTS, ExerciseType.SHADOWING],
        assessmentCriteria: [
          "Distinct vowel production",
          "Appropriate vowel length"
        ],
        estimatedMinutes: 25
      }
    ]
  },
  {
    path: LearningPath.RHYTHM_FLOW,
    name: "The Beat Keeper",
    forWho: "You sound flat or monotonous. Your timing is off. You need to feel the music of English.",
    modules: [
      {
        id: 'rf-1',
        name: "Stress-Timing 101",
        description: "English is stress-timed, not syllable-timed",
        objectives: [
          "Understand content words vs function words",
          "Learn to stress content words, reduce function words",
          "Practice with timed exercises"
        ],
        exercises: [ExerciseType.BEAT_MAPPING, ExerciseType.SHADOWING, ExerciseType.METRONOME_PRACTICE],
        assessmentCriteria: [
          "Clear stress differentiation",
          "Natural rhythm emerging"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'rf-2',
        name: "The Schwa: Your Secret Weapon",
        description: "The most common sound in English that you're probably not using",
        objectives: [
          "Identify where schwa appears in words",
          "Produce schwa consistently",
          "Reduce unstressed syllables appropriately"
        ],
        exercises: [ExerciseType.SCHWA_SPOTTING, ExerciseType.SHADOWING, ExerciseType.DICTATION],
        assessmentCriteria: [
          "Appropriate reduction",
          "Maintained intelligibility"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'rf-3',
        name: "Intonation Patterns",
        description: "The melody that conveys meaning",
        objectives: [
          "Master statement intonation (falling)",
          "Master yes/no question intonation (rising)",
          "Master WH-question intonation (falling)",
          "Use intonation for emphasis"
        ],
        exercises: [ExerciseType.INTONATION_MAPPING, ExerciseType.SHADOWING, ExerciseType.ROLE_PLAY],
        assessmentCriteria: [
          "Appropriate intonation for context",
          "Natural melody"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'rf-4',
        name: "Emphasis & Focus",
        description: "How to highlight what's important",
        objectives: [
          "Use contrastive stress (I didn't say HE stole it, I said SHE did)",
          "Highlight new information",
          "De-emphasize given information"
        ],
        exercises: [ExerciseType.FOCUS_DRILLS, ExerciseType.SHADOWING, ExerciseType.CONVERSATION],
        assessmentCriteria: [
          "Clear emphasis placement",
          "Natural information structure"
        ],
        estimatedMinutes: 20
      }
    ]
  },
  {
    path: LearningPath.VOCABULARY_SLANG,
    name: "The Culture Code",
    forWho: "Your pronunciation is good, but you sound like a textbook. Time to sound REAL.",
    modules: [
      {
        id: 'vs-1',
        name: "Essential Slang: Tier 1",
        description: "The slang everyone uses every day",
        objectives: [
          "Master: gonna, wanna, gotta, kinda, sorta",
          "Master: cool, chill, dope, lit, fire (when appropriate)",
          "Master: vibe, lowkey, highkey, GOAT, slaps"
        ],
        exercises: [ExerciseType.CONTEXT_MATCHING, ExerciseType.DIALOGUE_PRACTICE, ExerciseType.FREESTYLE],
        assessmentCriteria: [
          "Appropriate usage",
          "Natural integration"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'vs-2',
        name: "Phrasal Verbs: The American Way",
        description: "The verbs that make English so confusing (and natural)",
        objectives: [
          "Master: figure out, work out, hang out, check out",
          "Master: put up with, come up with, get away with",
          "Master: blow up, break down, show up, turn up"
        ],
        exercises: [ExerciseType.REPLACE_FORMAL, ExerciseType.DIALOGUE_PRACTICE, ExerciseType.SHADOWING],
        assessmentCriteria: [
          "Correct usage",
          "Natural selection over formal alternatives"
        ],
        estimatedMinutes: 20
      },
      {
        id: 'vs-3',
        name: "Filler Words & Hedges",
        description: "The 'ums' and 'likes' that make you sound human",
        objectives: [
          "Use: like, you know, I mean, basically",
          "Use: kinda, sorta, pretty much, more or less",
          "Use appropriate hedging: might, could, probably"
        ],
        exercises: [ExerciseType.NATURAL_INSERTION, ExerciseType.SHADOWING, ExerciseType.CONVERSATION],
        assessmentCriteria: [
          "Natural filler usage",
          "Not overused"
        ],
        estimatedMinutes: 15
      },
      {
        id: 'vs-4',
        name: "Cultural References & Expressions",
        description: "The stuff that makes Americans laugh and nod",
        objectives: [
          "Understand common references (sports, TV, movies)",
          "Use expressions: that's a stretch, no cap, bet, say less",
          "Navigate small talk topics"
        ],
        exercises: [ExerciseType.REFERENCE_MATCHING, ExerciseType.ROLE_PLAY, ExerciseType.DIALOGUE_PRACTICE],
        assessmentCriteria: [
          "Recognition and appropriate use",
          "Cultural sensitivity"
        ],
        estimatedMinutes: 20
      }
    ]
  }
];
