import { ChatCompletionRequestMessage } from "openai";
import { vectorStore } from "../../lib/supabaseVSClient";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'
import { supabase as supabaseClient } from '../../lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  runtime: 'edge', // this is a pre-requisite
};

// These are locations in the game world. Change them accordingly. However, you will need the corresponding images in the public folder
// example: world-canyon.png, world-castle.png
const dndLocations ="canyon | inn | oasis | inn | library | castle | forest"

const outputParse = `\nOutput the answer only in properly-formatted JSON {"location": "the conversation restricted to only these locations (LOCATION_NAMES)", 
    "setup": "description of place", "response”: ".."}\n`;

const perfectReply = `PERFECT REPLY:
NPC_NAME would always reply to the player in a first person perspective. The reply would always be in the manner that NPC_NAME's background and stats would allow.
      When the player asked a question that was beyond the scope of NPC_NAME's understanding, the reply usually attributed the answer
      as something that was made by alien technology beyond human understanding. You'll notice that NPC_NAME always naturally varied 
      the phrasing of each new response it gave to seem human-like and maintain a natural cadence of conversation.
      
      Human:`;
export default async function handler(req: any, res: any) {
  const request = await req.json();
  //console.log(request);
  const systemPayload = request.systemPayload;
  const userPayload = request.userPayload;
  const chatHistory = request?.chatHistory ?? null;
  const npcID = request?.npcID ?? null;
  const userID = request?.userID ?? null;
  const isIntro = request?.isIntro ?? false;
  const actionType = request?.actionType ?? "speech";
  const npcName = request?.npcName ?? "";
  
  let messageList = [];
  let combinedContext = null;
  const modifiedOutputParse = outputParse.replace(/LOCATION_NAMES/g, dndLocations);
  // If this is in introduction speech, set up the previous chat history if any, and also the last context the previous conversastion was started
  // such as location and how the player met the NPC
  if(isIntro){
    console.log("Intro: get initial chat if any and combine with old history");
    /*
    const result = await vectorStore.similaritySearch("environmentImage", 1, { userID: userID, npcID: npcID, role: "assistant" });
    console.log("Similarity search result:")
    console.log(result[0].pageContent);
    */
    

    const {data: initialChat, error} = await supabaseClient.from('documents').select("role:metadata->>role,content")
                                    .eq('metadata->>npcID', npcID).eq('metadata->>userID', userID)
                                    .eq('metadata->>role', "assistant").eq('metadata->>action', "preamble").order('id', { ascending: false })
                                    .limit(1).single();
   //console.log("Initial chat:");
   //console.log(initialChat?.content);
   const initialChatContent = initialChat?.content;

   const {data: oldHistory, error:oldHistoryError} = await supabaseClient.from('documents').select(`role:metadata->>role, content`)
                                    .eq('metadata->>npcID', npcID).eq('metadata->>userID', userID).eq('metadata->>action', "speech")
                                    .order('id', { ascending: false })
                                    .limit(4);
                                    console.log("Old History:");
                                    console.log(oldHistory);

   // If there is old chat history, combine it into the initial chat context
   if(oldHistory != null && oldHistory?.length > 0){
    combinedContext = initialChatContent + "\n" + oldHistory?.reverse().map((item: any) => item.content).join("\n");
    //console.log(combinedContext);
   }
  }

  // If this isn't an introduction speech, set up the previous chat history if any
  if(!isIntro && chatHistory ){
    console.log("Not intro, but have chat history");
    const vectorStoreChatHistory = await vectorStore.similaritySearch(userPayload, 2, { userID: userID, npcID: npcID, action: "speech" });
    console.log("VectorStore chat history:");
    console.log("search term:"+userPayload);
    //console.log(vectorStoreChatHistory);
    messageList = [{role: "system", content: systemPayload}]
                  .concat(chatHistory).concat({role: "user", content:  perfectReply.replace(/NPC_NAME/g, npcName)+userPayload+modifiedOutputParse});
  }

  // If this is an introduction speech, set up the previous chat history if any, and also the last context the previous conversastion was started
  else if(isIntro && combinedContext !== null){
    console.log("Intro, have chat history");
    const newUserPayload = `${combinedContext}\n Based on the supplied context and conversation history, when the ${npcName} meets the player again, he would greet the
    player accordingly, and location would be based off the last conversation history.`;
    messageList = [{role: "system", content: systemPayload}].concat({role: "user", content:  perfectReply.replace(/NPC_NAME/g, npcName)+newUserPayload+modifiedOutputParse});
  }

  // This is called if there is no chat history, and the user is starting a conversation with the NPC
  else{
    console.log("Intro and No chat history");
    messageList = [{role: "system", content: systemPayload}].concat({role: "user", content: perfectReply.replace(/NPC_NAME/g, npcName)+userPayload+modifiedOutputParse});
  }
  
  /*
  else {
    messageList = [{role: "system", content: systemPayload}].concat({role: "user", content: userPayload});
  }*/
  //console.log(messageList);
  console.log("Sending data to chat completion");
  
  const url = 'https://api.openai.com/v1/chat/completions';
  const requestOptions = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      'body': JSON.stringify({
        'model': process.env.GPT_MODEL_CONVERSATION ?? 'gpt-3.5-turbo',
        'max_tokens': 2000,
        'temperature': 0.7,
        'messages': messageList,
      }),
    };
    //completion.data.choices[0].message?.content;
    const response = await fetch(url, requestOptions);
    const json = await response.json();
    //console.log(json);
    const msgResponse = json.choices[0].message?.content;

  // Add question and response to VectorStore memory
  const docs = [
    { pageContent: userPayload, metadata: { userID: userID, npcID: npcID, role: "user", action: actionType } },
    { pageContent: msgResponse, metadata: { userID: userID, npcID: npcID, role: "assistant", action: actionType } },
  ];
  //console.log(docs);
  await vectorStore.addDocuments(docs);
  const responseOptions = {
    'headers': {
      'content-type': 'application/json',
    },
  };
  return new Response(JSON.stringify(json.choices[0].message.content), responseOptions);
  //res.status(200).json({ result: "test" });
}

function createPrompt(charBackground: string, charHistory: string, userQuery: string) {
  return `Act as the roleplaying character based on the following character background:
  ${charBackground}\n

  ${charHistory}\n
  `;
}

