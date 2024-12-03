"use client";

import { Send, Bot, User2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return; // Jangan kirim jika input kosong

    // Tambahkan pesan pengguna ke daftar pesan
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    setIsSubmitting(true); // Tampilkan indikator loading

    try {
      // Streaming response dari API
      const response = await fetch("/api/genai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            prompt: input,
          },
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let botMessage = ""; // Untuk menyimpan respons dari bot
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        // Decode value menjadi string
        const chunkValue = decoder.decode(value);

        try {
          // Parsing jika streamingResponse adalah JSON
          const parsedChunk = JSON.parse(chunkValue);
          botMessage += parsedChunk.text; // Sesuaikan dengan struktur respons Anda
        } catch {
          // Jika tidak dalam format JSON, langsung tambahkan chunkValue
          botMessage += chunkValue;
        }

        // Tambahkan respons bot secara bertahap
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.sender !== "bot"),
          { sender: "bot", text: botMessage },
        ]);
      }

    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setIsSubmitting(false); // Sembunyikan indikator loading
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <RenderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <RenderMessages messages={messages} />
    </main>
  );
}

function RenderForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (input: string) => void;
  isSubmitting: boolean;
}) {
  const [input, setInput] = useState<string>("");

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(input);
    setInput(""); // Kosongkan input setelah pengiriman
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full flex flex-row gap-2 items-center h-full"
    >
      <input
        type="text"
        placeholder="Coba tanya sesuatu..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border-b border-dashed outline-none w-full px-4 py-2 text-[#426ec7] placeholder:text-[#426ec7] text-right focus:placeholder-transparent"
      />
      <button
        type="submit"
        className="rounded-full shadow-md border flex flex-row"
        disabled={isSubmitting} // Hanya tombol yang diblokir
      >
        {isSubmitting ? (
          <span className="animate-spin h-6 w-6 border-2 border-t-transparent rounded-full"></span>
        ) : (
            <Send className="p-3 h-10 w-10 stroke-stone-500" />
          )}
      </button>
    </form>
  );
}

function RenderMessages({
  messages,
}: {
  messages: { sender: string; text: string }[];
}) {
  return (
    <div className="mt-4 w-full">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 border-b shadow-md rounded-md relative ml-10 mb-4 ${message.sender === "user" ? "text-right text-[#426ec7] bg-stone-300" : "text-left text-[#3a3a3a] bg-stone-400"
            }`}
        >
          {message.text}
          {message.sender === 'user' ? <User2 className="absolute top-2 -left-10 p-1 shadow-lg stroke-[#0842A0]"/> : <Bot className="absolute top-2 -left-10"/>}
        </div>
      ))}
    </div>
  );
}
