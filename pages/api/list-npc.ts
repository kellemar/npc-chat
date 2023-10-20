import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_URL ?? " ",
  token: process.env.UPSTASH_TOKEN ?? " ",
})

export default async function (req: NextApiRequest, res: NextApiResponse) {
  
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser(req.cookies["sb-access-token"]);
  const startTime = Date.now();
  //const {data: user_npc, error} = await supabaseServerClient.from('user_npc').select("*").eq('user_id', user?.id);
  if(!user){
    res.status(401).json({ error: 'Unauthorized' })
    return  
  }
  const {data: user_npc, error} = await supabaseServerClient.from('user_npc').select("*").eq('user_id', user?.id);
    
  //console.log(user_npc);
  const npcData = user_npc?.map(npc => {
    let formattedDate = "";
    if (typeof npc.created_at === 'string') {
        const createdAtDate = new Date(npc.created_at);
        if (!isNaN(createdAtDate.getTime())) {
            formattedDate = createdAtDate.toLocaleDateString('en-GB');
        }
    }
    
    return {
    id: npc.id,
    name: npc.name,
    gender: npc.gender,
    race: npc.race,
    characterClass: npc.character_class,
    traits: npc.traits,
    personality: npc.personality,
    accent: npc.accent,
    conversationalStyle: npc.conversational_style,
    alignment: npc.alignment,
    gameSetting: npc.game_setting,
    attitude: npc.attitude,
    createdAt: formattedDate
    };
});
  res.status(200).json({ result: npcData });
}



