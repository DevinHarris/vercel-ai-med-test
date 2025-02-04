'use client'

import { useState } from "react"
import { Message, continueConversation } from './actions'
import { readStreamableValue } from "ai/rsc"

export const maxDuration = 30;

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <div className="my-10" key={index}>
              <span style={{ fontWeight: '500' }}>{message.role}</span>: <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <input 
          type="text" 
          className=" dark:bg-zinc-900  p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          onChange={event => {
            setInput(event.target.value)
          }} />
        <button
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