"use client";
import { Send } from "lucide-react";
import { useChat } from "ai/react"; // Asumsi: 'ai/react' adalah hook untuk chatting
import { useState } from "react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'api/genai'
  });
  const [userMessage, setUserMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUserMessage(input); // Menyimpan pesan user

    // Mengirim prompt ke API
    const response = await handleSubmit(event, {
      data: {
        prompt: input,
      },
    });

    // Menyimpan pesan dari AI
    if (response && response.text) {
      setAiMessage(response.text);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      {RenderForm()}
      {RenderMessages()}
    </main>
  );

  function RenderForm() {
    return (
      <form
        onSubmit={handleFormSubmit}
        className="w-full flex flex-row gap-2 items-center h-full"
      >
        <input
          type="text"
          placeholder="Coba tanya sesuatu..."
          value={input}
          onChange={handleInputChange}
          className="border-b border-dashed outline-none w-full px-4 py-2 text-[#426ec7] placeholder:text-[#426ec7] text-right focus:placeholder-transparent"
        />
        <button type="submit" className="rounded-full shadow=md border flex flex-row">
          <Send className="p-3 h-10 w-10 stroke-stone-500" />
        </button>
      </form>
    );
  }

  function RenderMessages() {
    return (
      <div className="messages">
        <div className="user-message">{userMessage}</div>
        <div className="ai-message">{aiMessage}</div>
      </div>
    );
  }
}
