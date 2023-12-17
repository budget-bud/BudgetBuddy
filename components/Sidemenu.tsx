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

  const getData = async (): Promise<void> => {
    const response = await fetch(`/api/sidemenu`, {
      method: "GET",
    }).then((res) => res.json());

    setData(response);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isNullOrUndefined(data)) {
    return (
      <div
        className={`animate-pulse md:min-w-[300px] min-w-[100vw] absolute md:relative z-30 transition-all h-screen bg-black flex flex-col items-center md:flex${
          isSidemenuOpen ? "" : " hidden"
        }`}
      >
        <div className="flex w-full justify-center mt-[0.5rem] font-bold text-xl ">
          Budget Buddy
        </div>
        <div className="flex w-full justify-center mt-[2rem]">
          <div className="flex w-3/4  h-[4rem] justify-center items-center bg-secondary_700 text-black rounded-md ">
            <span className="w-1/2">
              <div className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] bg-primary_200 rounded-full ml-3">
                <div className="flex w-full h-full justify-center items-center text-white text-2xl font-bold">
                  {}
                </div>
              </div>
            </span>
            <span className="w-1/2 font-semibold text-sm sm:text-base"></span>
          </div>
        </div>
        <div className="w-full mt-[2rem]">
          <SidemenuButton button_type={"new_chat"} />
          <SidemenuButton button_type={"spendings"} balance={0} />
          <SidemenuButton button_type={"goals"} />
          <SidemenuButton button_type={"categories"} />
          <SidemenuButton button_type={"plots"} />
        </div>
        <div className="w-[75%] my-[2rem] flex flex-row items-center">
          <div className="w-fit whitespace-nowrap mr-3">Chat history</div>
          <div className="w-full bg-secondary_500 h-0.5"></div>
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
      className={`md:min-w-[300px] min-w-[100vw] absolute md:relative z-30 transition-all h-screen bg-black flex flex-col items-center md:flex${
        isSidemenuOpen ? "" : " hidden"
      }`}
    >
      <div className="flex w-full justify-center mt-[0.5rem] font-bold text-xl ">
        Budget Buddy
      </div>
      <div className="flex w-full justify-center mt-[2rem]">
        <div className="flex w-3/4  h-[4rem] justify-center items-center bg-secondary_700 text-black rounded-md ">
          <span className="w-1/2">
            <div className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] bg-primary_200 rounded-full ml-3">
              <div className="flex w-full h-full justify-center items-center text-white text-2xl font-bold">
                {getInitials(data.name)}
              </div>
            </div>
          </span>
          <span className="w-1/2 font-semibold text-sm sm:text-base">
            {data.name}
          </span>
        </div>
      </div>
      <div className="w-full mt-[2rem]">
        <SidemenuButton button_type={"new_chat"} />
        <SidemenuButton button_type={"spendings"} balance={data.balance} />
        <SidemenuButton button_type={"goals"} />
        <SidemenuButton button_type={"categories"} />
        <SidemenuButton button_type={"plots"} />
      </div>
      <div className="w-[75%] my-[2rem] flex flex-row items-center">
        <div className="w-fit whitespace-nowrap mr-3">Chat history</div>
        <div className="w-full bg-secondary_500 h-0.5"></div>
      </div>
      <div className="space-y-[1rem] w-full flex flex-col items-center">
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
