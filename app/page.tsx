"use client";

import {useChat} from "ai/react";
import { Send, Bot, User2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: 'api/genai'
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      {RenderForm()}
      {RenderMessages()}
      {JSON.stringify(messages)}
    </main>
  );


  function RenderForm(){
  
    return (
      <form
        onSubmit={(event)=>{
          event.preventDefault();
          handleSubmit(event, {
            data: {
              prompt: input
            }
          })
        }}
        className="w-full flex flex-row gap-2 items-center h-full"
      >
        <input
          type="text"
          placeholder="Coba tanya sesuatu..."
          value={input}
          onChange={handleInputChange}
          className="border-b border-dashed outline-none w-full px-4 py-2 text-[#426ec7] placeholder:text-[#426ec7] text-right focus:placeholder-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row"
        >
          <Send className="p-3 h-10 w-10 stroke-stone-500" />
        </button>
      </form>
    );
  }
  
  function RenderMessages(){

  }
}

