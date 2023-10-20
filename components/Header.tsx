import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
export default function Header() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const sessionContext = useSessionContext();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
}
  return (
    <header className="relative z-10 flex justify-between items-center w-full border-b-2 pt-2 pb-2 sm:px-4 px-2 bg-purple-800">
      <Link href="/" className="flex space-x-3">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight text-white">
          DnD NPC
        </h1>
      </Link>
      {sessionContext.session && <button onClick = {handleSignOut} className="text-xs text-black"><h1 className="sm:text-xl text-2xl font-bold ml-2 tracking-tight text-white">
          Sign Out
        </h1></button>}
    </header>
  );
}
