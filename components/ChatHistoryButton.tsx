// COMPONENTS
import Link from "next/link";

type ChatHistoryButtonProps = {
  chat_id: number;
};

const ChatHistoryButton: React.FC<ChatHistoryButtonProps> = ({
  chat_id,
}: ChatHistoryButtonProps) => {
  return (
    <div className="w-full flex justify-center">
      <Link
        className="flex w-3/4  h-[2rem] cursor-pointer  justify-center items-center
          bg-secondary_700 hover:bg-secondary_500 text-black rounded-md font-bold"
        href={"/chat"}
      >
        <div className="w-full flex justify-center text-xs sm:text-base ">
          Chat history {chat_id}
        </div>
      </Link>
    </div>
  );
};

export default ChatHistoryButton;
