export enum FortuneLevel {
  GREAT_LUCK = '上上签',
  GOOD_LUCK = '上吉签',
  MEDIUM_LUCK = '中吉签',
  FAIR_LUCK = '中平签',
  LOWER_LUCK = '下下签' // Included for completeness, though Gemini will be biased towards positive/constructive.
}

export interface FortuneData {
  level: string;
  title: string;
  poem: string[]; // Array of 4 lines
  interpretation: string;
  advice: {
    career: string;
    love: string;
    health: string;
    wealth: string;
  };
}

export interface GenerateFortuneResponse {
  fortune: FortuneData;
}