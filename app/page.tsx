'use client'

import { useState } from "react"
import { Message, continueConversation } from './actions'
import { readStreamableValue } from "ai/rsc"

export const maxDuration = 30;

const fontColor = '#979eaa'

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  return (
    <div>
      <div className="w-full text-center py-5" style={{ color: fontColor, borderBlockEnd: `1px solid ${fontColor}`}}>
         <h1 className="my-5 text-2xl" style={{ fontWeight: '600' }}>AI-Powered Gut Health Solutions</h1>
         <p>Experience a cutting-edge approach to digestive wellness with AI-driven personalized treatment plans. Our advanced system analyzes symptoms, dietary habits, and health history to craft a natural, science-backed solution tailored to your needs. Using intelligent insights, we recommend targeted dietary adjustments and supplements to restore balance and optimize gut health. Take control of your well-being with precision-guided strategies and long-term relief.</p>
      </div>
      <div style={{ color: fontColor, paddingBlockEnd: '10rem' }}>
        {conversation.map((message, index) => (
          <div className="my-10" key={index}>
              <span style={{ fontWeight: '500' }}>{message.role}</span>: <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex flex-col w-full mx-auto">
        <input 
          type="text"
          placeholder="Start chatting with our AI!"
          className=" dark:bg-zinc-900  px-10 py-5 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          onChange={event => {
            setInput(event.target.value)
          }} />
        <button
        className="px-10 py-5 bg-slate-800 text-white"
          onClick={async () => {
            const { messages, newMessage } = await continueConversation([
              ...conversation,
              {
                role: 'user',
                content: input
              }
            ])

            let textContent = '';
            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;

              setConversation(() => {

                setInput('');
                return [
                  ...messages,
                  {
                    role: 'assistant',
                    content: textContent
                  }
                ]
              })
            }
          }}
        >
          Send message
        </button>
      </div>

    </div>
  )
}