import { Toaster, toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown'
import {FaCopy, FaPlayCircle} from 'react-icons/fa';
import Image from 'next/image';

type Answer = {
  id: number,
  question: string,
  output: string,
  articleLink?: Array<string>,
  video?: string,
  image_generated?: string
};

type AnswerPropsType = {
  outputAnswer: Array<Answer>,
};


export default function Answer({ outputAnswer }: AnswerPropsType) {

  const video = "";
  const listItems = outputAnswer.map(({ id, question, output, articleLink, video, image_generated }) =>
    <>
      <div className="space-y-2 flex flex-col items-center justify-center min-w-m max-w-xl mx-auto w-full">
      <div
            className="mt-5 ml-auto p-10 bg-purple-300 rounded-xl text-black text-s px-2 mb-2 py-2">
            {question}
        </div>
        <div className="flex items-center bg-purple-100 rounded-xl shadow-md p-4 hover:bg-purple-200 transition border w-full" key={id}>
        {image_generated && (
              <Image className="top-0 left-0 rounded-full" src={"/"+image_generated.toLowerCase()+".png"} alt={output} width={100} height={100} />
           
          )}
          <div className="text-left m-5">{output}</div>
          <button
            className="mt-5 ml-auto p-10 bg-purple-400 rounded-xl text-white text-xs px-2 mb-2 py-2 hover:bg-purple-500"
            onClick={() => {
              navigator.clipboard.writeText(output);
              toast("Text copied!", {
                icon: "✂️",
              });
            }}>
            <FaCopy/>
          </button>
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
