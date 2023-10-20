import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import NPC from "../../components/NPC";
import LoadingDots from "../../components/LoadingDots";
import Link from 'next/link';
import BackgroundImage from '../../components/BackgroundImage';



const Home: NextPage = () => {

  const [npcList, setNPCList] = useState<any[]>([]);


  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerList, updateAnswerList] = useState<any[]>([]);
  const [timeTaken, setTimeTaken] = useState("");
  const auth_key = process.env.NEXT_PUBLIC_AUTH_KEY || "NA";
  const api_url = process.env.NEXT_PUBLIC_SERVER_API_URL || "NA";
  
  const answerRef = useRef<null | HTMLDivElement>(null);
  const gameName = useRef("");

  const scrollToBios = () => {
    if (answerRef.current !== null) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const input = question;
  useEffect(() => {
    generateNPCs();
  
  }, []);
  
  const generateNPCs = async () =>{
    
    setLoading(true);
    const endpoint = '/api/list-npc/'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response =  await fetch(endpoint, options);
    const output = await response.json();
    console.log("data.result", output.result);
    
    setNPCList(output.result.reverse());
    setLoading(false);
    
  };

  const generateAnswer = async (e: any) => {
    setTimeTaken("");
    const startTime = Date.now();
    e.preventDefault();
    setLoading(true);
    console.log(answerList);
    const chat_history = answerList
    .map(
      (item) => `Human: ${item.question}\nAI: ${item.output}\n`
    )
    .join("");

    //console.log(chat_history);
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth_key
      },
      body: JSON.stringify({
        chat_history,input,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();
   
    setLoading(false);
    setTimeTaken((((Date.now() - startTime) % 60000) / 1000) + "");
    const outputOnly = result.output;
    const article = result.sources;
    const video = result.video;
    const image_generated = result?.image_generated;
    const outputID = Buffer.from(Date.now()+"").toString('base64');
    gameName.current = result?.games_listed?.[0];
    console.log(result);
    
    updateAnswerList([...answerList, { "id": outputID, "question": input, "output": outputOnly, "articleLink": article, "video": video, "image_generated": image_generated }]);
    setQuestion("");
    scrollToBios();    
  };

  return (
    <div className=" relative flex mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Your DnD NPCs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <BackgroundImage 
        src={"/world-library.png"} 
        alt="Background Image"
        generatedValue={true}
      />
      <main className="relative flex flex-1 w-full flex-col items-center text-center px-4 mt-5">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-100">
         Your DnD NPCs
        </h1>
        <div className="max-w-xl w-full">
        <div className="flex items-center justify-center space-x-3">
            <Link href={`/npc/create`} passHref>
              <button onClick={(e) => setQuestion(e.currentTarget.innerHTML)}
                className="bg-purple-400 rounded-xl text-white text-s px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full h-20 sm:h-12">
                Create Your DnD NPCs
              </button>
              </Link>
             
            </div>
          <div className="space-y-5 my-2">
            {npcList && (
              <>
                <NPC outputNPC={npcList} />
              </>
            )}
          </div>
           {/* 
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "What's your question?"
            }
          /> */}
         
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-black/80 w-full"
              disabled
            >
              Loading your Characters <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>


      </main>
      <Footer />
    </div>
  );
};

export default Home;
