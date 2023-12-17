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
    <div className="flex w-full justify-center">
      <Link
        className="flex h-[2rem]  w-3/4 cursor-pointer  items-center justify-center
          rounded-md bg-secondary-700 font-bold text-background-50 hover:bg-secondary-600"
        href={`/chat/${id}`}
      >
        <div className="flex w-full justify-center text-base ">{name}</div>
      </Link>
    </div>
  );
};

export default ChatHistoryButton;
