// COMPONENTS
import Link from "next/link";

type ChatHistoryButtonProps = {
  id: string;
  name: string;
};

const ChatHistoryButton: React.FC<ChatHistoryButtonProps> = ({
  id,
  name,
}: ChatHistoryButtonProps) => {
  return (
    <div className="w-full flex justify-center">
      <Link
        className="flex w-3/4  h-[2rem] cursor-pointer  justify-center items-center
          bg-secondary_700 hover:bg-secondary_500 text-black rounded-md font-bold"
        href={`/chat/${id}`}
      >
        <div className="w-full flex justify-center text-xs sm:text-base ">
          {name}
        </div>
      </Link>
    </div>
  );
};

export default ChatHistoryButton;
