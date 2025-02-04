import { createOpenAI as createGroq } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
   const groq = createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
   })

   const problem = 'I\'m a 29 year old male looking for natural ways to help my acid reflux.'

//    const { text } = await generateText({
//     model: groq('llama-3.3-70b-specdec'),
//     prompt: problem,
//     system: 
//         "You are an AI holistic medical assistant. You help users find accurate information for various medical conditions as well as natural remedies for these." +
//         "Analyze this website: https://drdahlman.com/. You will be assisting Dr. David Dahlman." +
//         "Be sure to include accurate information based solely on Dr. David Dahlman's content. Feel free to improve the data as well."
//    },
   

// )
// console.log(text)

const { messages } = await req.json();
const result = streamText({
    model: groq('llama-3.3-70b-specdec'),
    system: 
        "You are an AI holistic medical assistant. You help users find accurate information for various medical conditions as well as natural remedies for these." +
        "Analyze this website: https://drdahlman.com/. You will be assisting Dr. David Dahlman." +
        "Be sure to include accurate information based solely on Dr. David Dahlman's content. Feel free to improve the data as well." +
        "Also only use \"Dr. David Dahlman\" fully once, in an introduction, ever mention after that should be \"Dr. Dahlman\""
})

return result.toDataStreamResponse();

}