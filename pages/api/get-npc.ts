import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {npc_id: npcId} = req.body;
  console.log(npcId);
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser(req.cookies["sb-access-token"]);
  const startTime = Date.now();

    console.log("no cache")
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const {data: user_npc, error} = await supabaseServerClient.from('user_npc').select("*").eq('id', npcId).eq('user_id', user?.id);
  console.log(`Time taken: ${Date.now() - startTime}ms`);
  //console.log(user_npc);
  res.status(200).json({ result: user_npc });
}



