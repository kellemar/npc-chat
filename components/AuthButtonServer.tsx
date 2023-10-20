import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function AuthButtonServer(){
    const supabase = createServerComponentClient<Database>({cookies});
    const { data : {session} } = await supabase.auth.getSession();
    const router = useRouter();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }


    return (
        (session && <button className="text-xs text-gray-400" onClick={handleSignOut}>SignOut</button>)
        
    )
}