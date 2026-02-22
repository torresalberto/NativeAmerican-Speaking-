import { Level } from '../types';

export interface LevelDefinition {
  name: Level;
  range: [number, number]; // score range
  description: string;
  phoneticMarkers: string[];
  canDo: string[];
  workingOn: string[];
  targetTimeToNextLevel: string;
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    name: Level.TOURIST,
    range: [1, 3],
    description: "You're understood, but your accent is clearly non-native. You're speaking 'textbook English'.",
    phoneticMarkers: [
      "Word-by-word pronunciation (no connected speech)",
      "Hard /t/ sounds where flap-t is expected",
      "/θ/ and /ð/ substitutions (using /t/, /d/, /s/, or /z/)",
      "Vowels are often too pure/tense (not relaxed American vowels)",
      "Syllable-timed rhythm instead of stress-timed"
    ],
    canDo: [
      "Be understood in most situations",
      "Handle basic transactions",
      "Have simple conversations"
    ],
    workingOn: [
      "Basic connected speech patterns (gonna, wanna, gotta)",
      "The flap-t (better = bedder)",
      "Relaxing vowel sounds",
      "Word stress basics"
    ],
    targetTimeToNextLevel: "2-4 weeks of daily practice"
  },
  {
    name: Level.LOCAL,
    range: [4, 7],
    description: "You sound comfortable. People might ask 'where are you from?' but you blend in most casual conversations.",
    phoneticMarkers: [
      "Using connected speech in common phrases",
      "Flap-t is appearing but inconsistent",
      "/θ/ and /ð/ are mostly accurate",
      "Vowels are more relaxed",
      "Some stress-timing emerging"
    ],
    canDo: [
      "Follow fast casual speech",
      "Use common reductions naturally",
      "Handle small talk comfortably",
      "Understand most slang in context"
    ],
    workingOn: [
      "Consistent flap-t usage",
      "Advanced contractions (would've, could've, should've)",
      "Intonation patterns for questions/statements",
      "Rhythm in longer sentences",
      "Slang production (not just comprehension)"
    ],
    targetTimeToNextLevel: "4-8 weeks of daily practice"
  },
  {
    name: Level.INSIDER,
    range: [8, 10],
    description: "You sound American. People are surprised when you mention you're not native. You get the jokes, the references, the vibes.",
    phoneticMarkers: [
      "Automatic connected speech",
      "Consistent flap-t",
      "Natural stress-timing",
      "American vowel quality",
      "Appropriate intonation for all contexts"
    ],
    canDo: [
      "Understand rapid casual speech",
      "Use slang appropriately and naturally",
      "Adjust register for different contexts",
      "Get cultural references and wordplay",
      "Sound natural on the phone (the ultimate test)"
    ],
    // FIX: Removed duplicate 'canDo' property which caused a syntax error.
    workingOn: [
      "Regional nuances (if desired)",
      "Professional register refinement",
      "Cultural fluency deepening",
      "Rare/advanced slang"
    ],
    targetTimeToNextLevel: "Continuous refinement"
  }
];