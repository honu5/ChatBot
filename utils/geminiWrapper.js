import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDV34GiCLEsh5kJwii_CpWZcGxjMxxIFG8");

export async function getGeminiResponse(userMessage, conversationHistory = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Convert conversation history into a prompt
  const historyText = conversationHistory.map(entry => {
    return `User: ${entry.message}\nAssistant: ${entry.response}`;
  }).join("\n");

  const prompt = `${historyText}\nUser: ${userMessage}\nAssistant:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "No response from model.";
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't get a response right now. Check your connection and try again.";
  }
}