import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import useSound from 'use-sound';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from "next/navigation";

const CreateNPC: NextPage = () => {

  const [outputSound, setOutputSound] = useState("");
  const [play, { stop }] = useSound(outputSound);

  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const router  = useRouter();

  const [isDisabled, setIsDisabled] = useState(true);
  const [npcSaving, setNpcSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSound, setLoadingSound] = useState(false);
  const [question, setQuestion] = useState("");
  const [generateBackgroundWarningTxt, setGenerateBackgroundWarningTxt] = useState("");
 
  const [submitState, setSubmitState] = useState(1);

  const [backgroundStory, setbackgroundStory] = useState("");
  const [additionalInfo, setadditionalInfo] = useState("");

  const answerRef = useRef<null | HTMLDivElement>(null);
  const gameName = useRef("");

  const input = question;
  const scrollToBios = () => {
    if (answerRef.current !== null) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  

  function validateData(data: any) {
    for (let key of Object.keys(data)) {
      if (!data[key] || data[key].trim() === '') {
        return false;
      }
    }
    return true;
  }
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

    const changeBackgroundStory = async (event: any) => {
      setbackgroundStory(event.target.value);
      if(event.target.value.length > 20){
        setIsDisabled(false);
      }
      else{
        setIsDisabled(true);
      }
  
    };


  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    console.log("handle submit triggered");
    event.preventDefault();
    
    const data = {
      name: event.target.name.value,
      gender: event.target.gender.value,
      race: event.target.race.value,
      class: event.target.class.value,
      traits: event.target.traits.value,
      alignment: event.target.alignment.value,
      conversationalStyle: event.target.conversationalStyle.value,
      attitude: event.target.attitude.value,
      gameSetting: event.target.location.value,
      
    };
    console.log(data);
    if (!validateData(data)) {
      console.log("data is not valid");
      setSubmitState(1);
      setGenerateBackgroundWarningTxt("Please fill in all the fields.");
      return 1;
    }
    else{
      const validatedData = {...data, background: event.target.backgroundStory.value, additionalInfo: event.target.additionalInfo.value};
      if(submitState == 1){
        setLoading(true);
        setIsDisabled(true);
      }
      else {
        setNpcSaving(true);
      }
      const JSONdata = JSON.stringify(validatedData);
      const endpoint = ['/api/generate-background', '/api/save-npc']
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
      };
      const response = await fetch(endpoint[submitState - 1], options);
      const output = await response.json();
      console.log(output);
      setbackgroundStory(output);
      setLoading(false);
      setNpcSaving(false);
      setIsDisabled(false);
      if(submitState == 2){
        router.push('/npc/list');
      }
      setSubmitState(1);
    }
  };


  return (
    <div className="relative flex mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Create an NPC</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="fixed inset-0">
     <Image src="/world-dark-library.png" alt="background image of library" layout="fill"
            objectFit="cover"
            priority={true}/></div>
      <main className=" relative flex flex-1 w-full flex-col items-center text-center px-4 mt-5">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-100">
          Create a DnD NPC
        </h1>
        {!user ? (
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} theme="dark" />
        ) : (
          <div className="max-w-xl w-full">
            <div className="flex items-center justify-center space-x-3">
            <Link href={`/npc/list`} passHref>
              <button onClick={(e) => setQuestion(e.currentTarget.innerHTML)}
                className="bg-purple-400 rounded-xl text-white text-xs px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full h-20 sm:h-12">
                List Your NPCs
              </button>
              </Link>
             
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 mt-4">
                <label className="block text-slate-100 text-sm font-bold mb-2  ">Character Name</label>
                <input name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name of your NPC" />
              </div>

              
              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Gender</label>
                <select name="gender" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="gender">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Race</label>
                <select name="race" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="race">
                  <option value="">Select...</option>
                  <option selected value="Human">Human</option>
                  <option selected value="Elf">Elf</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Class</label>
                <select name="class" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="class">
                  <option value="">Select...</option>
                  <option value="Warrior">Warrior</option>
                  <option value="Rogue">Rogue</option>
                  <option value="Wizard">Wizard</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Personality Traits</label>
                <select name="traits" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="traits">
                  <option value="">Select...</option>
                  <option value="Nothing can shake my optimistic attitude.">Nothing can shake my optimistic attitude.</option>
                  <option value="I’ve spent so long in the temple that I have little practical experience dealing with people in the outside world.">I’ve spent so long in the temple that I have little practical experience dealing with people in the outside world.</option>
                  <option value="Sarcasm and insults are my weapons of choice.">Sarcasm and insults are my weapons of choice.</option>
                  <option value="I always have a plan for what to do when things go wrong.">I always have a plan for what to do when things go wrong.</option>
                  <option value="I don’t pay attention to the risks in a situation. Never tell me the odds.">I don’t pay attention to the risks in a situation. Never tell me the odds.</option>
                  <option value="	I know a story relevant to almost every situation.">	I know a story relevant to almost every situation.</option>
                  <option value="I’m confident in my own abilities and do what I can to instill confidence in others.">I’m confident in my own abilities and do what I can to instill confidence in others.</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Conversational Style</label>
                <select name="conversationalStyle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="conversationalStyle">
                  <option value="">Select...</option>
                  <option value="Formal">Formal</option>
                  <option value="Informal">Informal</option>
                  <option value="Old-Fashioned">Old-Fashioned</option>
                  <option value="Poetic">Poetic</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Cold">Cold</option>
                  <option value="Sarcastic">Sarcastic</option>
                  <option value="Eloquent">Eloquent</option>
                  <option value="Mysterious">Mysterious</option>
                  <option value="Cheerful">Cheerful</option>
                  <option value="Pessimistic">Pessimistic</option>
                  <option value="Optimistic">Optimistic</option>
                </select>

              </div>

              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Alignment</label>
                <select name="alignment" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="alignment">
                  <option value="">Select...</option>
                  <option value="Lawful Good">Lawful Good</option>
                  <option value="Neutral Good">Neutral Good</option>
                  <option value="Chaotic Good">Chaotic Good</option>
                  <option value="Lawful Neutral">Lawful Neutral</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Chaotic Neutral">Chaotic Neutral</option>
                  <option value="Lawful Evil">Lawful Evil</option>
                  <option value="Neutral Evil">Neutral Evil</option>
                  <option value="Chaotic Evil">Chaotic Evil</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Attitude towards Players</label>
                <select name="attitude" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="attitude">
                  <option value="">Select...</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Cautious">Cautious</option>
                  <option value="Hostile">Hostile</option>
                </select>
              </div>

              
              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">From whereabouts in the Forgotten Realms?</label>
                <select name="location" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="location">
                  <option value="">Select...</option>
                  <option value="Waterdeep">Waterdeep</option>
                  <option value="Calimport">Calimport</option>
                  <option value="Cormyr">Cormyr</option>
                  <option value="Calimshan">Calimshan</option>
                  <option value="Underdark">Underdark</option>
                  <option value="Baldur's Gate">Baldur's Gate</option>
                  <option value="Candlekeep">Candlekeep</option>
                  <option value="Evereska">Evereska</option>
                </select>
              </div>

              
              <div className="mb-4">
                <label className="block text-slate-100 text-sm font-bold mb-2 ">Background/History</label>
                
                <div className="mb-4">
                {!loading && (
                  <button onClick={(e) => setSubmitState(1)} type="submit" id="generateBackground" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                    Generate Background Story
                  </button>
                )}

                {loading && (
                  <button
                    className="bg-blue-500 rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-blue-500 w-full"
                    disabled
                  >
                    Creating your Story <LoadingDots color="white" style="large" />
                  </button>
                )}
                <p className=" text-rose-500">{generateBackgroundWarningTxt}</p>
              </div>

                <textarea name="backgroundStory" id="backgroundStory" value={backgroundStory} onChange={(e) => changeBackgroundStory(e)} placeholder={
                  "Add something about the character's history or background, or generate one based on the details you've provided above."
                } rows={10} className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black " />

                {false && (
                  <div className=" text-right ">
                    <button type="button" onClick={(e) => playSound()} id="playNarration" className=" text-xs bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                      </svg>
                    </button>
                  </div>
                )}

                {loadingSound && (
                  <div className=" text-right ">
                    <button disabled className=" text-xs bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>Loading
                    </button>
                  </div>
                )}

              </div>

              

              <div className="mb-4">
                <label className="block text-white text-sm font-bold ">Additional Information to the Character</label>
                <textarea id="additionalInfo" value={additionalInfo} onChange={(e) => setadditionalInfo(e.target.value)} placeholder={
                  "You can add more information the character here, such as friends and enemies, or interesting quirks."
                } rows={10} name="additionalInfo" className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5" />
              </div>



              <div className="mt-4">
                {!npcSaving && (
                  <button disabled = {isDisabled} onClick={(e) => setSubmitState(2)} type="submit" id="saveNPC" className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                    {isDisabled ? "Generate Background Story (More than 20 characters) First" : "Create NPC"}
                  </button>
                )}

                {npcSaving && (
                  <button
                    className="bg-black rounded-xl text-white font-medium px-4 py-2 mt-2 hover:bg-blue-500 w-full"
                    disabled
                  >
                    Busy creating your NPC <LoadingDots color="white" style="large" />
                  </button>
                )}

              </div>

            </form>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default CreateNPC;
