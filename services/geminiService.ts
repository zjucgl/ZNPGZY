import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTaskRequirements = async (taskName: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an assistant for a teacher. 
    Generate a short, professional list of 3-5 grading criteria/requirements for a student homework assignment titled: "${taskName}".
    Format it as a single paragraph string suitable for a database text field. Keep it under 200 characters if possible, concise and clear. 
    Language: Chinese (Simplified).`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "无法生成要求，请手动输入。";
  } catch (error) {
    console.error("Error generating requirements:", error);
    return "AI 服务暂时不可用，请稍后再试。";
  }
};

export const gradeSubmission = async (taskRequirements: string, studentContent: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an intelligent grading assistant.
    Task Requirements: ${taskRequirements}
    
    Student Submission:
    "${studentContent}"
    
    Please provide a brief critique and a score (0-100).
    Language: Chinese (Simplified).
    Format: 
    分数: [Score]
    评语: [1-2 sentences of feedback]
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "无法完成批改。";
  } catch (error) {
    console.error("Error grading submission:", error);
    return "AI 批改服务出错。";
  }
};
