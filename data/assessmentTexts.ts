
import { AssessmentText } from '../types';

export const ASSESSMENT_TEXTS: AssessmentText[] = [
  {
    id: 'flap-t',
    text: "Better butter makes better batter. I'm pretty certain about that.",
    targets: [
      {
        sound: 'ɾ', // flap-t
        examples: ['better', 'butter', 'pretty'],
        commonErrors: ['Using hard /t/', 'Using /d/']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'connected-speech',
    text: "What are you going to do about it? I would've called, but I didn't want to.",
    targets: [
      {
        sound: 'wɑɾəjə', // whatcha/whaddya
        examples: ["What are you", "going to", "would've"],
        commonErrors: ['Word-by-word pronunciation', 'Missing reductions']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'th-sounds',
    text: "I think they're over there with their mother and father.",
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
    text: "He can't decide between the red and the green. It's really not that bad.",
    targets: [
      {
        sound: 'æ/ɛ/ɪ',
        examples: ['can\'t', 'red', 'green', 'really', 'bad'],
        commonErrors: ['Vowel confusion', 'Neutral vowels instead of specific']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'rhythm-stress',
    text: "I DIDN'T say he STOLE my money. I said he MIGHT have.",
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
