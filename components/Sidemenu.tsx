"use client";

// COMPONENTS
import SidemenuButton from "./SidemenuButton";
import ChatHistoryButton from "./ChatHistoryButton";

const Sidemenu = () => {
  //TODO: Implement Sidemenu
  return (
    <div className="w-[350px] h-screen bg-black flex flex-col items-center">
      <div className="flex w-full justify-center mt-[0.5rem] font-bold text-xl ">
        Budget Buddy
      </div>
      <div className="flex w-full justify-center mt-[2rem]">
        <div className="flex w-3/4  h-[4rem] justify-center items-center bg-secondary_700 text-black rounded-md ">
          <span className="w-1/2">
            <div className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] bg-primary_200 rounded-full ml-3">
              {" "}
            </div>
          </span>
          <span className="w-1/2 font-semibold text-sm sm:text-base">
            {" "}
            Jhon Doe{" "}
          </span>
        </div>
      </div>
      <div className="w-full mt-[2rem]">
        <SidemenuButton button_type={"spendings"} />
        <SidemenuButton button_type={"tracker"} />
      </div>
      <div className="w-[80%] my-[2rem] flex flex-row items-center">
        <div className="w-[50%] ">Chat history</div>
        <div className="w-[70%] bg-secondary_500 h-0.5"></div>
      </div>
      <div className="space-y-[1rem] w-full flex flex-col items-center">
        <ChatHistoryButton chat_id={1} />
        <ChatHistoryButton chat_id={2} />
        <ChatHistoryButton chat_id={3} />
      </div>
    </div>
  );
};

export default Sidemenu;
