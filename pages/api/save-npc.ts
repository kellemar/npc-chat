import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function (req: NextApiRequest, res: NextApiResponse) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser(req.cookies["sb-access-token"]);
  const {data, error} = await supabaseServerClient.from('user_npc').insert([
    {name: req.body.name, 
    race: req.body.race,
    gender: req.body.gender,
    character_class: req.body.class,
    traits: req.body.traits,
    personality: req.body.personality ?? "",
    alignment: req.body.alignment,
    accent: req.body.accent ?? "",
    conversational_style: req.body.conversationalStyle,
    game_setting: req.body.gameSetting,
    game: req.body.game ?? "",
    background_history: req.body.background,
    additional_info: req.body.additionalInfo,
    attitude: req.body.attitude,
    user_id: user?.id,
    created_by: user?.id
  }
  ]);
  res.status(200).json({ result: "test" });
}



