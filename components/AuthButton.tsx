"use client";
import { SupervisedUserCircleRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useRefreshSidemenuContext } from "./ContextProvider";

export default function AuthButton() {
  const router = useRouter();
  const { refreshSidemenu } = useRefreshSidemenuContext();
  
  const signOut = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    }).then((res) => res.json());
    if (response.error) {
      window.alert(response.error);
      return;
    }
    refreshSidemenu();
    router.push("/login");
  };

  return (
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
  );
}
