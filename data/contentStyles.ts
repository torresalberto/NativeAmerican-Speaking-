import { Goal } from '../types';

// Differentiate content types properly

export interface ContentStyle {
  style: 'casual' | 'slang';
  characteristics: string[];
  examplePhrases: string[];
}

export const CONTENT_STYLES: Record<Goal, ContentStyle> = {
  [Goal.CASUAL]: {
    style: 'casual',
    characteristics: [
      "Natural contractions (I'm, you're, we've)",
      "Common reductions (gonna, wanna)",
      "Relaxed but clean language",
      "Universally understood"
    ],
    examplePhrases: [
      "I'm gonna grab some coffee. Want anything?",
      "So what're you up to this weekend?",
      "That's pretty cool, actually."
    ]
  },
  [Goal.SLANG]: {
    style: 'slang',
    characteristics: [
      "Current slang (fire, lowkey, no cap)",
      "Internet/meme language",
      "Regional expressions",
      "Generational markers"
    ],
    examplePhrases: [
      "Bro that movie was lowkey fire, no cap.",
      "I'm dead 💀 that's actually hilarious.",
      "The vibes were immaculate, not gonna lie."
    ]
  }
};
