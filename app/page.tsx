"use client";

import {useChat} from "ai/react";
import { Send, Bot, User2, Loader2} from "lucide-react";
import Markdown from "./component/markdown";

export default function Home() {
  const {messages, input, handleInputChange, handleSubmit, isLoading, stop} = useChat({
    api: 'api/genai'
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      {RenderForm()}
      {RenderMessages()}
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
          placeholder={isLoading ? "Bentar ya..." : "Coba tanya sesuatu..."}
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          className="border-b border-dashed outline-none w-full px-4 py-2 text-[#426ec7] placeholder:text-[#426ec7] text-right focus:placeholder-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row"
        >
          {isLoading ? <Loader2 onClick={stop} className="p-3 h-10 w-10 stroke-stone-500 animate-spin"/> : <Send className="p-3 h-10 w-10 stroke-stone-500" />}
        </button>
      </form>
    );
  }
  
  function RenderMessages(){
    return (
      <div className="flex flex-col-reverse w-full text-left mt-4 gap-4 whitespace-pre-wrap">
        {messages.map((m,index)=>{
          return <div key={index} className={`p-2 shadow-md rounded-md ml-10 relative ${m.role === 'user' ? "bg-stone-300" : "bg-stone-500"}`}>
            <Markdown text={m.content}/>
            {m.role === 'user' ? <User2 className="absolute top-2 -left-10"/> : <Bot className={`absolute top-2 -left-10 animate-bounce-up stroke-[#426ec7] ${isLoading && index === messages.length-1 ? "animate-bounce" : ""}`}/>}
          </div>
        })}
      </div>
    )
  }
}

