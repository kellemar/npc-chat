import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Answer from "../../components/Answer";
import LoadingDots from "../../components/LoadingDots";
import { useRouter } from 'next/router'
import Link from 'next/link';
import BackgroundImage from '../../components/BackgroundImage';

import useSound from 'use-sound';


type NPC = {
  id?: number,
    name?: string,
    race?: string,
    character_class?: string,
    traits?: string,
    personality?: string,
    accent?: string,
    conversational_style?: string,
    alignment?: string,
    game_setting?: string,
    background_history?: string,
    user_id?: string,
    created_at?: string,
    updated_at?: string,
    additional_info?: string,
    attitude?:string,
    gender?: string,
    game?: string,
};

const dndLocations ="canyon | inn | oasis | inn | library | castle | forest"

const Converse: NextPage = () => {

  const [outputSound, setOutputSound] = useState("/output.mp3");
  const [play, { stop }] = useSound(outputSound);

  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  const SHORT_CONVO_HISTORY_LENGTH = 6;

  const [generatedValue, setGeneratedValue] = useState(true);

  const [npcBackground, setNpcBackground] = useState({} as NPC);
  const [systemMessage, setSystemMessage] = useState("");
  const [worldBackground, setWorldBackground] = useState("library");
  const [currentLocation, setCurrentLocation] = useState("");
  

  const [envLoading, setEnvLoading] = useState(true);
  const [charLoading, setCharLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  
  const [question, setQuestion] = useState("");
  const [answerList, updateAnswerList] = useState<any[]>([]);
  const [timeTaken, setTimeTaken] = useState("");
  const auth_key = process.env.NEXT_PUBLIC_AUTH_KEY || "NA";
  
  const answerRef = useRef<null | HTMLDivElement>(null);
  const gameName = useRef("");

  

  
  const scrollToBios = () => {
    if (answerRef.current !== null) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const input = question;
  const router = useRouter();
  const data = router.query;  
  const npcId = data?.id as string;
  

  useEffect(() => {
    
    console.log("useEffect - npcId:"+npcId);
    getNPC(npcId);
    
  
  }, [npcId]);

  const swapBackground = (bgImage: string) => {
    const bgTransitionTime = 2000;

    if(bgImage != currentLocation){
      setTimeout(() => {
        setGeneratedValue(false);
      }, bgTransitionTime);

      setWorldBackground(bgImage);
      setCurrentLocation(bgImage);

      setTimeout(() => {
        setGeneratedValue(true);
      }, bgTransitionTime);
      
    }
  
  
  }
  
  const getNPC = async (npcId: string) =>{
    
    setCharLoading(true);
    const endpoint = '/api/get-npc/'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        npc_id: npcId,
      }),
    };

    const response =  await fetch(endpoint, options);
    const output = await response.json();
    try{

        if(output["result"].length > 0){
        setNpcBackground(output["result"][0]);
        if(!introDone){
          generateIntro(output["result"][0]);
        }
        setCharLoading(false);
      }
    
    }
    catch(err){
      console.log(err);
    }
  };

  const generateSpeech = async (text: string) =>{
    
    const endpoint = '/api/set-text-speech/'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
      }),
    };

    const response =  await fetch(endpoint, options);
    const output = await response.json();
    
    
  };

  // a function called playSound
  const playSound = () => {
      
    if (!isSoundPlaying) {
      play();
      setIsSoundPlaying(true);
    }
    else{
      stop();
      setIsSoundPlaying(false);
    }

  };
  const generateIntro = async (npcInfo: NPC) =>{
    const startTime = Date.now();
    setEnvLoading(true);
    
    let systemPayload = `You are ${npcInfo.name}, a ${npcInfo.gender} ${npcInfo.race} ${npcInfo.character_class} 
    from ${npcInfo.game_setting}, and you are an NPC that communicates with the user, who is a player 
    in this roleplaying campaign. The time period is placed within a medieval fantasy setting.

    Your replies were always in the manner that your background and stats allowed. These were:
    traits: ${npcInfo.traits},
    personality: ${npcInfo.personality},
    accent: ${npcInfo.accent},
    conversational_style: ${npcInfo.conversational_style},
    alignment: ${npcInfo.alignment},
    character's origin: ${npcInfo.game_setting},
    background_history: ${npcInfo.background_history},
    attitude: ${npcInfo.attitude}
    
    SUPPORTING CONTEXT:
    The period is based within a medieval fantasy setting. The player is the leader of an adventuring party. ${npcInfo.name} is part of the player's team. `;

    
    const newSystemPayload = systemPayload;
    setSystemMessage(newSystemPayload);

    let userPayload = `Start by describing the environment (forest | inn | oasis) that the player (regarded as "You") encounters the NPC, 
    and when the player steps up, the NPC greets the player in first-person..`;
    
   
    const response = await fetch("/api/generate-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth_key
      },
      body: JSON.stringify({
        systemPayload:newSystemPayload,userPayload, npcID: npcInfo.id, userID: npcInfo.user_id, isIntro: true, actionType:"preamble", npcName: npcInfo.name,
        worldLocation: worldBackground, gameName: npcInfo.game
      }),
    });
    if (!response.ok) {
      //console.log(response);
      throw new Error(response.statusText);
    }
    
    const result = await response.json();
    console.log("generateIntro:");
    //console.log(result);
    if(result != null){
      const json_result = JSON.parse(result);
      const outputOnly = json_result.response;
      const article = "";
      const video = "";
      const image_generated = npcInfo.race?.toLowerCase()+"_"+npcInfo.character_class?.toLowerCase();
      console.log("generateIntro:"+image_generated);
      const outputID ="";
      const input = json_result.setup;
      gameName.current = "";
      //setWorldBackground(json_result.location);
      swapBackground(json_result.location);
      updateAnswerList([...answerList, { "id": outputID, "question": input, "output": outputOnly, "articleLink": article, "video": video, "image_generated": image_generated }]);

      await generateSpeech(outputOnly);
      setOutputSound("/output.mp3?"+Math.random() * 100);
      setIntroDone(true);
      setEnvLoading(false);
      
      setQuestion("");
      scrollToBios();   
    }
    setTimeTaken((((Date.now() - startTime) % 60000) / 1000) + "");
    
     
  };

  const generateAnswer = async (e: any) => {
    console.log("Generate Answer");
    
    setTimeTaken("");
    const startTime = Date.now();
    e.preventDefault();
    setLoading(true);
    //console.log(answerList);
    
    let chatHistory: { role: string; content: any; }[] = [];
    answerList.forEach(item => {
      chatHistory.push(
          { "role": "user", "content": item.question },
          { "role": "assistant", "content": item.output }
      )
  });
    if(chatHistory.length > SHORT_CONVO_HISTORY_LENGTH){
      chatHistory = chatHistory.slice(-SHORT_CONVO_HISTORY_LENGTH);
    }
    
    const response = await fetch("/api/generate-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth_key
      },
      body: JSON.stringify({
        systemPayload: systemMessage, userPayload:input, chatHistory: chatHistory, npcID: npcBackground.id, userID: npcBackground.user_id, actionType:"speech",
        npcName: npcBackground.name, worldLocation: worldBackground, gameName: npcBackground.game
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    
    const result = await response.json();
    //console.log(result);
    if(result != null){
        const json_result = JSON.parse(result);
        const outputOnly = json_result.response;
        const article = "";
        const video = "";
        const image_generated = npcBackground.race?.toLowerCase()+"_"+npcBackground.character_class?.toLowerCase();
        console.log(image_generated);
        const outputID =Buffer.from(Date.now()+"").toString('base64');
        gameName.current = "";
        swapBackground(json_result.location);
        updateAnswerList([...answerList, { "id": outputID, "question": input, "output": outputOnly, "articleLink": article, "video": video, "image_generated": image_generated }]);
        await generateSpeech(outputOnly);
        setOutputSound("/output.mp3?"+Math.random() * 100);
     
    }  
    setIntroDone(true);
    setLoading(false);
    setQuestion("");
    scrollToBios();   
  };

  return (
    <div className="relative flex mx-auto flex-col items-center justify-center min-h-screen bg-black">
     
      <Head>
        <title>DnD NPCs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>

      <BackgroundImage 
        src={"/world-"+worldBackground+".png"} 
        alt="Background Image"
        generatedValue={generatedValue}
      />
      <main className="relative z-10 flex flex-1 w-full flex-col items-center text-center px-4 mt-5">
        
        <div className=" bg-black p-10 bg-opacity-50">
        <h1 className=" sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-100 opacity-100">
          DnD NPC Chat
        </h1>
        </div>
        
       
        <Link href={`/npc/list`} passHref>
              <button onClick={(e) => setQuestion(e.currentTarget.innerHTML)}
                className="bg-purple-400 rounded-xl text-black text-s px-4 py-2 sm:mt-10 mt-8w-full h-20 sm:h-12">
                List Your NPCs
              </button>
              </Link>
        <div className="max-w-xl w-full">
        <div className="flex items-center justify-center space-x-3">
          {!charLoading && (
            <div  className="bg-purple-400 rounded-xl text-black text-m px-4 py-2 sm:mt-10 mt-8  w-full h-30 sm:h-22">
              You are currently chatting with {npcBackground.name}, a   {npcBackground.race} {npcBackground.gender}, a {npcBackground.character_class} and comes from {npcBackground.game_setting}.
            </div>
             )}
          </div>

          <div className="space-y-5 my-2">
            {charLoading && (
             <div className="mt-10 text-white">Planning the meeting with your character <LoadingDots color="white" style="large" /></div>

            )}

            {envLoading && (
             <div className="mt-10 text-white">Creating the environment and setting <LoadingDots color="white" style="large" /></div>

            )}    

            {answerList && (
              <>
                <Answer outputAnswer={answerList} />
              </>
            )}
          </div>
          
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "What's your question?"
            }
          />
         
          {!loading && (
            <div  ref={answerRef}>
            <button
              className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-blue/80 w-full"
              onClick={(e) => generateAnswer(e)}>
              Ask!
            </button>
            
            
            </div>
          )}
          {loading && (
            <button
              className="bg-blue-700 rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-blue/80 w-full"
              disabled
            >
              Thinking <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>


      </main>
      <Footer />
    </div>
  );
};

export default Converse;
