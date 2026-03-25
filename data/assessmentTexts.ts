import { AssessmentText } from '../types';

export const ASSESSMENT_TEXTS: AssessmentText[] = [
  {
    id: 'flap-t',
    text: "I'll grab a bottle of water later. It's way better than soda.",
    targets: [
      {
        sound: 'ɾ', // flap-t
        examples: ['bottle', 'water', 'later', 'better'],
        commonErrors: ['Using hard /t/', 'Using /d/']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'connected-speech',
    text: "What are you going to do about it? I would've come over, but I didn't want to be late.",
    targets: [
      {
        sound: 'wɑɾəjə', // whatcha/whaddya
        examples: ["What are you", "going to", "would've", "want to"],
        commonErrors: ['Word-by-word pronunciation', 'Missing reductions']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'th-sounds',
    text: "I think they're over there. They're with their brother.",
    targets: [
      {
        sound: 'θ/ð',
        examples: ['think', 'they\'re', 'there', 'their', 'brother'],
        commonErrors: ['Substituting /t/ or /d/', 'Substituting /s/ or /z/']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'vowel-quality',
    text: "I can't believe he's back. It's actually not that bad of a deal.",
    targets: [
      {
        sound: 'æ/ɛ/ɪ',
        examples: ['can\'t', 'back', 'actually', 'bad', 'deal'],
        commonErrors: ['Vowel confusion', 'Neutral vowels instead of specific']
      }
    ],
    difficulty: 'diagnostic'
  },
  {
    id: 'rhythm-stress',
    text: "I DIDN'T say he STOLE the money. I said he MIGHT'VE.",
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
