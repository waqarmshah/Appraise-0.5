import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { AppMode, AppraisalOutput } from '../types';

// Initialize Gemini
// NOTE: In a real production app, you might proxy this through a backend to protect the key,
// but for this MVP/SPA requirement, we use process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "The title of the case followed by a 2-3 sentence summary.",
    },
    capabilities: {
      type: Type.STRING,
      description: "Markdown bullet list of the 3 selected capabilities. Each justification MUST be written in the FIRST PERSON (e.g. 'I discussed...', 'I analysed...', 'I demonstrated...').",
    },
    reflection: {
      type: Type.STRING,
      description: "A reflective account of the clinical case or event.",
    },
    learningGoals: {
      type: Type.STRING,
      description: "Markdown bullet list of 3 specific, realistic, non-fluffy actions or PDP items.",
    },
  },
  required: ["summary", "capabilities", "reflection", "learningGoals"],
};

const suggestionsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 probing, open-ended questions that help the clinician add missing context or depth to their reflection.",
    }
  },
  required: ["questions"]
};

export const generateAppraisalContent = async (
  mode: AppMode,
  availableCapabilities: string[],
  selectedCapabilities: string[] | "AUTO",
  note: string
): Promise<AppraisalOutput | null> => {
  
  const capabilityListString = availableCapabilities.join(', ');
  const selectedString = Array.isArray(selectedCapabilities) 
    ? selectedCapabilities.join(', ') 
    : "AUTO";

  const prompt = `
Mode: ${mode}
Capabilities available: ${capabilityListString}
Selected capabilities (if any): ${selectedString}

Clinical note:
"""
${note}
"""

Task:
Create an appraisal-ready output in UK clinical tone.
Keep it factual; do not add new clinical facts.

Field Requirements:
1. summary: Combine a short Title (max 12 words) and a Summary (2–3 sentences) into this field.
2. capabilities: Pick exactly 3 (if AUTO) or use user selections. Format as a markdown list. CRITICAL: WRITE JUSTIFICATIONS IN THE FIRST PERSON (e.g. "I discussed...", "I checked...").
3. reflection: Write a concise reflection on the event.
4. learningGoals: 3 bullets (specific, realistic, non-fluffy).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AppraisalOutput;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateSuggestions = async (
  mode: AppMode,
  note: string
): Promise<string[]> => {
  const prompt = `
Mode: ${mode}
Clinical Note:
"""
${note}
"""

Task:
Analyze this clinical note/reflection. Identify 3 gaps where the reflection is shallow or details are missing.
Ask 3 direct, probing questions to the clinician. The answers to these questions should improve the quality of the appraisal entry.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful clinical supervisor asking clarifying questions.",
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: suggestionsSchema,
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text) as { questions: string[] };
      return result.questions || [];
    }
    return [];
  } catch (error) {
    console.error("Gemini Suggestions Error:", error);
    return [];
  }
};
