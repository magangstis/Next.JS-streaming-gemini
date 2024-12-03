import { GoogleGenerativeAI } from "@google/generative-ai";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const prompt = reqBody.data.prompt;

    // Membuat instance dari GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    // Mendapatkan response stream dari model
    const streamingResponse = await model.generateContentStream(prompt);

    console.log("Hasil streaming:", streamingResponse);

    // Mendapatkan response data
    const responseData = await streamingResponse.response;
    console.log("Response data:", responseData);

    // Mengakses candidates secara langsung jika bentuknya adalah objek
    const candidates = responseData.candidates;
    
    console.log("Teks diambil langsung dari respons : ", responseData.text)

    // Cek tipe dan akses data dengan cara yang lebih fleksibel
    if (candidates && Object.values(candidates).length > 0) {
      const firstCandidate = Object.values(candidates)[0]; // Mengambil elemen pertama
      if (firstCandidate && firstCandidate.content && Array.isArray(firstCandidate.content.parts)) {
        // Menggabungkan semua bagian teks di dalam 'parts' menjadi satu kalimat utuh
        const text = firstCandidate.content.parts.map(part => {
          if (typeof part === 'object' && part.text) {
            return part.text; // Ambil properti 'text' jika ada
          }
          return part; // Kembalikan sebagai string jika bukan objek
        }).join('');

        console.log("Text from candidates:", text);

        // Membuat stream untuk response ke client
        const stream = new Readable();
        stream.push(text); // Mengirimkan teks sebagai bagian dari stream
        stream.push(null); // Menandakan akhir stream

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } else {
        console.log("Konten dalam candidates tidak ditemukan atau tidak sesuai.");
        return new Response("Konten dalam candidates tidak ditemukan atau tidak sesuai.", {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      console.log("Tidak ada kandidat yang ditemukan.");
      return new Response("Tidak ada kandidat yang ditemukan.", {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
