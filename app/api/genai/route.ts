import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamText } from "ai"; // Asumsi: Mengimport namespace yang benar

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  const prompt = reqBody.data.prompt;

  // Membuat instance dari GoogleGenerativeAI
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Mendapatkan response stream dari model
  const streamingResponse = await model.generateContentStream(prompt);

  // Menggunakan langchainAdapter.toDataStreamResponse untuk menangani stream
  return streamText.toDataStreamResponse(streamingResponse);
}
