import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDV34GiCLEsh5kJwii_CpWZcGxjMxxIFG8");

export async function getGeminiResponse(userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Free-tier model

  try {
    const result = await model.generateContent(userMessage);
    const response = result.response;

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response from model.";
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't get a response right now.Check your connection and try again";
  }
}


