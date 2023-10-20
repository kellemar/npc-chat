import { Configuration, OpenAIApi } from "openai";
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge', // this is a pre-requisite
};
export default async function handler(req: NextRequest) {
  const prompt = await req.json();
  const payload = backgroundPrompt(prompt);
  const url = 'https://api.openai.com/v1/chat/completions';
  const requestOptions = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      'body': JSON.stringify({
        'model': process.env.GPT_MODEL_GENERATION ?? 'gpt-3.5-turbo',
        'max_tokens': 3000,
        'temperature': 0.7,
        'messages': [{'role': 'user', 'content': `${payload}`}],
      }),
    };
    const response = await fetch(url, requestOptions);
    const json = await response.json();
    
    const responseOptions = {
        'headers': {
          'content-type': 'application/json',
        },
      };
      return new Response(JSON.stringify(json.choices[0].message.content), responseOptions);
  
}

function backgroundPrompt(charSheet: any) {
  return `A character history and background of a roleplaying NPC was created in the land of Faerun in Dungeons and Dragons: Forgotten Realms.
  It was very descriptive and detailed about the background of the character.
  Character Details:
  Name: ${charSheet.name}
  Race: ${charSheet.race}
  Gender: ${charSheet.gender}
  Character Class: ${charSheet.class}
  Moral Alignment: ${charSheet.alignment}
  Personality Traits: ${charSheet.traits}
  Conversational Style when talking to the player: ${charSheet.conversationalStyle}
  Where the NPC came from in Faerun: ${charSheet.gameSetting}
  Attitude Towards Player: ${charSheet.attitude}
  `;
}

