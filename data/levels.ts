import { Level } from '../types';

export interface LevelDefinition {
  name: Level;
  range: [number, number];
  description: string;
  phoneticMarkers: string[];
  canDo: string[];
  workingOn: string[];
  targetTimeToNextLevel: string;
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    name: Level.TOURIST,
    range: [1, 4],
    description: "You're understood, but your accent is very prominent. You often translate word-for-word from your native language.",
    phoneticMarkers: [
      "Syllable-timed rhythm (every syllable has equal weight)",
      "Hard /t/ sounds instead of flaps",
      "Vowels are often neutralized or substituted",
      "Limited use of connected speech"
    ],
    canDo: [
      "Handle basic survival interactions",
      "Be understood with some effort from the listener",
      "Produce individual sounds correctly in isolation"
    ],
    workingOn: [
      "Basic vowel distinctions",
      "Introduction to the flap-t",
      "Beginning to link words together"
    ],
    targetTimeToNextLevel: "20-30 hours of focused practice"
  },
  {
    name: Level.LOCAL,
    range: [5, 7],
    description: "You sound natural and clear. You use common reductions and have a good grasp of American rhythm, though some 'foreign' markers remain.",
    phoneticMarkers: [
      "Consistent use of the flap-t in common words",
      "Good use of 'gonna', 'wanna', 'gotta'",
      "Developing sentence-level stress patterns",
      "Most vowel distinctions are clear"
    ],
    canDo: [
      "Participate in most social and professional conversations",
      "Use common slang and idioms correctly",
      "Self-correct many pronunciation errors"
    ],
    workingOn: [
      "Nuanced intonation for emotion and attitude",
      "Advanced linking and reductions",
      "Mastering tricky vowel pairs (e.g., /ɪ/ vs /i/)"
    ],
    targetTimeToNextLevel: "40-60 hours of focused practice"
  },
  {
    name: Level.INSIDER,
    range: [8, 10],
    description: "You're often mistaken for a native speaker. Your flow, rhythm, and use of cultural nuance are highly advanced.",
    phoneticMarkers: [
      "Native-like stress-timed rhythm",
      "Nuanced use of pitch and intonation",
      "Advanced connected speech (e.g., 'whaddya', 'didja')",
      "Precise vowel quality even in rapid speech"
    ],
    canDo: [
      "Navigate complex cultural nuances and humor",
      "Speak with high confidence in any setting",
      "Use a wide range of slang and registers appropriately"
    ],
    workingOn: [
      "Subtle regional variations (if desired)",
      "Perfecting 'micro-rhythms' of specific social groups",
      "Maintaining peak performance in high-stress situations"
    ],
    targetTimeToNextLevel: "Continuous refinement"
  }
];
