"use client";

// COMPONENTS
import SidemenuButton from "./SidemenuButton";
import ChatHistoryButton from "./ChatHistoryButton";
import { isNullOrUndefined } from "@/utils/isNullOrUndefined";
import { useEffect, useState } from "react";
import { ISidemenuParams } from "@/types/types";
import { useSidemenuContext } from "./ContextProvider";
import { Close } from "@mui/icons-material";

const Sidemenu = () => {
  const { isSidemenuOpen, setIsSidemenuOpen } = useSidemenuContext();
  const [data, setData] = useState<ISidemenuParams>(
    null as unknown as ISidemenuParams,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async (): Promise<void> => {
    const response = await fetch(`/api/sidemenu`, {
      method: "GET",
    }).then((res) => res.json());
    setIsLoading(false);
    if (response.error) {
      console.error(response.error);
      return;
    }

    setData(response);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isNullOrUndefined(data)) {
    return (
      <div
        className={`${
          isLoading ? "animate-pulse" : ""
        } absolute z-30 flex h-screen min-w-[100vw] flex-col items-center bg-primary-800 transition-all md:relative md:min-w-[300px] md:flex${
          isSidemenuOpen ? "" : " hidden"
        }`}
      >
        <div className="mt-[0.5rem] flex w-full justify-center text-xl font-bold">
          Budget Buddy
        </div>
        <div className="mt-[2rem] flex w-full justify-center">
          <div className="bg-secondary_700 flex h-[4rem] w-3/4 items-center justify-center rounded-md text-background-950 ">
            <span className="w-1/2">
              <div className="bg-primary_200 ml-3 h-[50px] w-[50px] rounded-full">
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"></div>
              </div>
            </span>
            <span className="w-1/2 text-base font-semibold"></span>
          </div>
        </div>
        <div className="mt-[2rem] w-full">
          <SidemenuButton button_type={"new_chat"} />
          <SidemenuButton button_type={"spendings"} balance={0} />
          <SidemenuButton button_type={"goals"} />
          <SidemenuButton button_type={"categories"} />
          <SidemenuButton button_type={"plots"} />
        </div>
        <div className="my-[2rem] flex w-[75%] flex-row items-center">
          <div className="mr-3 w-fit whitespace-nowrap">Chat history</div>
          <div className="bg-secondary_500 h-0.5 w-full"></div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <div
      className={`absolute z-30 flex h-screen min-w-[100vw] flex-col items-center bg-accent-800 transition-all md:relative md:min-w-[300px] md:flex${
        isSidemenuOpen ? "" : " hidden"
      }`}
    >
      <div className="mt-[0.5rem] flex w-full justify-center text-xl font-bold text-text-100 ">
        Budget Buddy
      </div>
      <div className="mt-[2rem] flex w-full justify-center">
        <div className="flex h-[4rem]  w-3/4 items-center justify-center rounded-md bg-primary-600 text-background-950 ">
          <span className="w-1/2">
            <div className="ml-3 h-[50px] w-[50px] rounded-full bg-primary-800">
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-100">
                {getInitials(data.name)}
              </div>
            </div>
          </span>
          <span className="w-1/2 text-base font-semibold">{data.name}</span>
        </div>
      </div>
      <div className="mt-[2rem] w-full">
        <SidemenuButton button_type={"new_chat"} />
        <SidemenuButton button_type={"spendings"} balance={data.balance} />
        <SidemenuButton button_type={"goals"} />
        <SidemenuButton button_type={"categories"} />
        <SidemenuButton button_type={"plots"} />
      </div>
      <div className="my-[2rem] flex w-[75%] flex-row items-center">
        <div className="mr-3 w-fit whitespace-nowrap text-text-100">
          Chat history
        </div>
        <div className="h-0.5 w-full bg-text-100"></div>
      </div>
      <div className="flex w-full flex-col items-center space-y-[1rem] overflow-auto">
        {data.chats.map((chat) => (
          <ChatHistoryButton key={chat.id} id={chat.id} name={chat.title} />
        ))}
      </div>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsSidemenuOpen(false);
        }}
        className="absolute right-0 top-0 p-3 md:hidden"
      >
        <Close />
      </button>
    </div>
  );
};

export default Sidemenu;
