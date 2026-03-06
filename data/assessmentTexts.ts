
import { AssessmentText } from '../types';

export const ASSESSMENT_TEXTS: AssessmentText[] = [
  {
    id: 'flap-t',
    text: "I'm heading to the city later to grab some water. Whaddya think about that?",
    targets: [
      {
        sound: 'ɾ', // flap-t
        examples: ['heading', 'city', 'later', 'water', 'whaddya'],
        commonErrors: ['Using hard /t/', 'Using /d/']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'connected-speech',
    text: "Whatcha gonna do tonight? I woulda called but I didn't wanna bug ya.",
    targets: [
      {
        sound: 'wɑɾəjə', // whatcha/whaddya
        examples: ["Whatcha", "gonna", "woulda", "wanna"],
        commonErrors: ['Word-by-word pronunciation', 'Missing reductions']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'th-sounds',
    text: "I think they're over there with their mother and father. Check 'em out.",
    targets: [
      {
        sound: 'θ/ð',
        examples: ['think', 'they\'re', 'there', 'their', 'mother', 'father'],
        commonErrors: ['Substituting /t/ or /d/', 'Substituting /s/ or /z/']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'vowel-quality',
    text: "He can't decide between the red and the green. It's lowkey not that bad.",
    targets: [
      {
        sound: 'æ/ɛ/ɪ',
        examples: ['can\'t', 'red', 'green', 'really', 'bad', 'lowkey'],
        commonErrors: ['Vowel confusion', 'Neutral vowels instead of specific']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'rhythm-stress',
    text: "I DIDN'T say he STOLE my money. I'm just sayin' he MIGHT have.",
    targets: [
      {
        sound: 'stress-timing',
        examples: ['sentence-level stress', 'emphasis patterns'],
        commonErrors: ['Syllable-timed speech', 'Flat intonation']
      }
    ],
    difficulty: 'diagnostic'
  }
];
