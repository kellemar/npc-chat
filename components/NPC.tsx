import { Toaster, toast } from "react-hot-toast";
import Image from 'next/image';
import Link from 'next/link';

type NPC = {
  id: number,
  name: string,
  gender: string,
  race: string,
  characterClass: string,
  traits: string,
  personality: string,
  accent: string,
  conversationalStyle: string,
  alignment: string,
  gameSetting: string,
  attitude: string,
  createdAt: string,

};

type NPCPropsType = {
  outputNPC: Array<NPC>,
};


export default function NPC({ outputNPC }: NPCPropsType) {

  console.log(outputNPC);
  
  
  const listItems = outputNPC.map(({ id, name, gender, race, characterClass, alignment, createdAt }) =>
    <>
      <div className="space-y-2 flex flex-col items-center justify-center min-w-m max-w-xl mx-auto w-full">
        
        <div
          className="flex items-center mt-5 ml-auto p-10 bg-purple-200 rounded-xl text-black text-s px-2 mb-2 py-2 w-full text-left">
          <Image className="top-0 left-0 rounded-full" src={"/"+race.toLowerCase()+"_"+characterClass.toLowerCase()+".png"} alt={characterClass} width={100} height={100} />
          <div className="ml-5">
          Name: {name}<br />Class: {characterClass}
          <br />Gender: {gender}<br />Race: {race}<br />Alignment: {alignment}<br />Created: {createdAt}
          <Link href={{
    pathname: '/npc/converse',
    query: {id} 
  }} passHref>
          <button
            className="mt-2 w-full bg-purple-400 rounded-xl text-white text-xs px-2 mb-2 py-2 hover:bg-purple-500">
            Choose this Character
          </button>
          </Link>
          </div>
        </div>
           
        
      </div>
    </>

  );
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      {listItems}
    </>
  );
}
