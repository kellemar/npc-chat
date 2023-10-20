import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/supabase'


export default async function (req: any, res: any) {
    /*
    const supabaseServerClient = createPagesServerClient<Database>({
        req,
        res,
      })
      const {
        data: { user },
      } = await supabaseServerClient.auth.getUser(req.cookies["sb-access-token"]);
    const client = new textToSpeech.TextToSpeechClient();
    const request = {
        input: {text: req.body.text},
        // Select the language and SSML voice gender (optional)
        voice: {name: 'en-US-Neural2-I', languageCode: 'en-US', ssmlGender: 'MALE'},
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
      };
    
    const outputFile = './public/output.mp3';
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFile, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${outputFile}`);
    */
    res.status(200).json({ result: "done conversion" });
    //res.status(200).json({ result: "test" });
  }
  