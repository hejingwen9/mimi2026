import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FortuneData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fortuneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    level: {
      type: Type.STRING,
      description: "The luck level, strictly one of: '上上签', '上吉签', '中吉签', '中平签', '下下签'.",
    },
    title: {
      type: Type.STRING,
      description: "A 4-character philosophical title, e.g., '静水流深', '否极泰来'.",
    },
    poem: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A traditional Chinese poem consisting of EXACTLY 2 lines.",
    },
    interpretation: {
      type: Type.STRING,
      description: "A concise, colloquial (大白话) explanation.",
    },
    advice: {
      type: Type.OBJECT,
      properties: {
        career: { type: Type.STRING },
        love: { type: Type.STRING },
        health: { type: Type.STRING },
        wealth: { type: Type.STRING },
      },
      required: ["career", "love", "health", "wealth"],
    },
  },
  required: ["level", "title", "poem", "interpretation", "advice"],
};

// Fallback fortunes for when API is slow or fails
const FALLBACK_FORTUNES: FortuneData[] = [
  {
    level: "上吉签",
    title: "乘风破浪",
    poem: ["长风破浪会有时", "直挂云帆济沧海"],
    interpretation: "时机已经成熟，现在的阻力只是暂时的。拿出勇气，抓住眼前的机会，大干一场吧。",
    advice: {
      career: "大胆推行新计划，会有贵人相助。",
      love: "主动出击，不要犹豫。",
      health: "精力充沛，适合运动。",
      wealth: "投资运佳，看准就下手。"
    }
  },
  {
    level: "中平签",
    title: "韬光养晦",
    poem: ["潜龙勿用久藏修", "待时而动乐无忧"],
    interpretation: "现在还不是出头的最佳时机。建议保持低调，多积累实力，等待更好的风口。",
    advice: {
      career: "守成为上，避免大变动。",
      love: "顺其自然，不要强求。",
      health: "注意休息，避免过劳。",
      wealth: "储蓄为主，不宜冒险。"
    }
  },
  {
    level: "中吉签",
    title: "守得云开",
    poem: [
      "山重水复疑无路",
      "柳暗花明又一村"
    ],
    interpretation: "目前的困难只是暂时的迷雾。坚持下去，很快就会看到转机，好运正在赶来的路上。",
    advice: {
      career: "坚持目前的努力，不要轻言放弃。",
      love: "多沟通，误会很快会消除。",
      health: "心情舒畅是最好的良药。",
      wealth: "正财稳定，偏财随缘。",
    }
  }
];

// Define distinct themes to force variety in Gemini's output
const FORTUNE_THEMES = [
  {
    type: "Bold Action",
    direction: "Encourage bold progress. The time is now. Take risks.",
    keywords: "Courage, Breakthrough, Initiative, Speed",
    levels: ["上上签", "上吉签"]
  },
  {
    type: "Extreme Caution",
    direction: "Warn against risks. Stay put and conserve energy. Danger ahead.",
    keywords: "Patience, Defense, Observation, Retreat",
    levels: ["下下签", "中平签"]
  },
  {
    type: "Steady Growth",
    direction: "Focus on slow, steady accumulation. Hard work pays off. No shortcuts.",
    keywords: "Perseverance, Learning, Steadiness, Diligence",
    levels: ["中吉签", "上吉签"]
  },
  {
    type: "Harmony & People",
    direction: "Seek harmony in relationships. Rely on others. Don't go it alone.",
    keywords: "Harmony, Peace, Compromise, Networking",
    levels: ["中平签", "中吉签"]
  },
  {
    type: "Windfall / Serendipity",
    direction: "Unexpected good luck or help from others (Noble People). A surprise awaits.",
    keywords: "Serendipity, Opportunity, Help, Luck",
    levels: ["上上签", "上吉签"]
  }
];

const getRandomFallback = () => FALLBACK_FORTUNES[Math.floor(Math.random() * FALLBACK_FORTUNES.length)];

export const generateFortune = async (): Promise<FortuneData> => {
  try {
    const modelId = "gemini-2.5-flash"; 
    
    // Pick a random theme
    const theme = FORTUNE_THEMES[Math.floor(Math.random() * FORTUNE_THEMES.length)];

    const prompt = `
      Context: 2026 (Year of Fire Horse).
      Theme: ${theme.type} (${theme.direction}).
      Keywords: ${theme.keywords}.
      Allowed Levels: ${JSON.stringify(theme.levels)}.

      Task: Generate a Chinese spiritual fortune (Lingqian).
      1. Poem: 2 lines, classical style.
      2. Interpretation: Simple, colloquial (大白话).
      3. Advice: Specific to Career, Love, Health, Wealth.
      
      Return valid JSON only.
    `;

    // Create the API promise
    const apiCall = ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fortuneSchema,
        temperature: 1.0, 
      },
    });

    // Create a timeout promise (3.5 seconds)
    // Animation is ~2.8s. 3.5s allows minimal buffer without long wait.
    const timeoutCall = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 3500)
    );

    // Race them
    const response = await Promise.race([apiCall, timeoutCall]);

    // If we get here, apiCall won.
    // Note: response might be null if TypeScript inference gets confused, but runtime is fine.
    if (!response || !response.text) {
      throw new Error("Empty response");
    }

    const data = JSON.parse(response.text) as FortuneData;
    return data;

  } catch (error) {
    console.warn("Fortune generation failed or timed out, using fallback:", error);
    return getRandomFallback();
  }
};
