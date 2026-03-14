import { Goal } from '../types';

export interface ContentStyle {
  style: string;
  characteristics: string[];
  examplePhrases: string[];
}

export const CONTENT_STYLES: { [key in Goal]: ContentStyle } = {
  [Goal.CASUAL]: {
    style: "Natural & Clear",
    characteristics: [
      "Focus on standard American connected speech",
      "Common reductions (gonna, wanna, gotta)",
      "Natural sentence-level stress and rhythm",
      "Clear, standard vowel quality"
    ],
    examplePhrases: [
      "I'm gonna head out in a bit.",
      "What are you guys up to tonight?",
      "I would've called, but my phone died."
    ]
  },
  [Goal.SLANG]: {
    style: "Fluent with Slang",
    characteristics: [
      "Heavy use of modern American slang and idioms",
      "Mastery of phrasal verbs",
      "Understanding of cultural subtext and nuance",
      "Advanced reductions and rapid speech patterns"
    ],
    examplePhrases: [
      "That party was low-key fire, no cap.",
      "I think he's just ghosting her at this point.",
      "Bet! I'll be there in five."
    ]
  }
};
