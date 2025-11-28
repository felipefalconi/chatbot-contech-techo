import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const { message } = req.body;
    const prompt = `
      Você é o Tekinho, o mascote virtual da contabilidade Contech.
      Seu tom é amigável, profissional e didático.
      Responda de forma concisa (máximo 3 parágrafos).
      O usuário perguntou: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Erro técnico no servidor." });
  }
}
