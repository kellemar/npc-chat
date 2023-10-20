import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from "next/navigation";
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link';



const Home: NextPage = () => {

  const supabase = useSupabaseClient();
  const sessionContext = useSessionContext();
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'

  return (
    <div className="flex mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Create an NPC</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />




      <main className="flex flex-1 w-full flex-col items-center text-center px-4 mt-5">
        <div className="container" style={{ padding: '50px 0 100px 0' }}>
          {!sessionContext.session ? (
            <Auth supabaseClient={supabase} redirectTo={url} appearance={{ theme: ThemeSupa }} providers={[]} theme="dark" />
          ) :
            (
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">Welcome to NPC Creator</h1>

                <Image src="/app_banner.png" alt="Banner of DND Companion NPC AI" className="rounded-xl" width={800} height={800} />

                <div className="flex items-center justify-center space-x-3">

                  <Link href={`/npc/create`} passHref>
                    <button
                      className="bg-purple-400 rounded-xl text-white text-s px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full h-20 sm:h-12">
                      Create DnD NPC
                    </button>
                  </Link>
                  <Link href={`/npc/list`} passHref>
                    <button
                      className="bg-purple-400 rounded-xl text-white text-s px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full h-20 sm:h-12">
                      List Your DnD NPC
                    </button>
                  </Link>

                </div>

              </div>

            )
          }
        </div>



      </main>
      <Footer />
    </div>
  );
};

export default Home;
