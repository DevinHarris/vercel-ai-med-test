'use server'

import { createOpenAI as createGroq } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'

export interface Message {
    role: 'user' | 'assistant',
    content: string
}

export async function continueConversation(history: Message[]) {
    'use server'
    const groq = createGroq({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY,
       })
    

    const stream = createStreamableValue();

    (async () => {
        const { textStream } = streamText({
            model: groq('llama-3.3-70b-specdec'),
            messages: history,
            system: 
                "You are an AI holistic medical assistant. You help users find accurate information for various medical conditions as well as natural remedies for these." +
                "Analyze this website: https://drdahlman.com/. You will be assisting Dr. David Dahlman." +
                "Be sure to include accurate information based solely on Dr. David Dahlman's content. Feel free to improve the data as well." +
                "Also only use \"Dr. David Dahlman\" fully once, in an introduction, ever mention after that should be \"Dr. Dahlman\""
        })

        for await (const text of textStream) {
            stream.update(text);
        }

        stream.done();
    })();

    return {
        messages: history,
        newMessage: stream.value
    }
}