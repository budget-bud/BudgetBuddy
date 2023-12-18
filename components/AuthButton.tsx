import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SupervisedUserCircleRounded } from "@mui/icons-material";

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex w-full justify-center" onClick={signOut}>
      <div
        className="mt-[1rem] flex h-[2rem] w-3/4 
          cursor-pointer items-center 
          rounded-md bg-secondary-300 
          font-bold 
          text-background-950 hover:bg-secondary-200"
      >
        <SupervisedUserCircleRounded className="ml-3" />
        <div className="ml-[1rem] w-full text-base">Log out</div>
      </div>
    </div>
  ) : (
    <Link
      href="/login"
      className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
    >
      Login
    </Link>
  );
}
