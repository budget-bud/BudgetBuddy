"use client";
import { IMessage } from "@/types/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRefreshSidemenuContext } from "./ContextProvider";

const Chat = () => {
  const router = useRouter();
  const { refreshSidemenu } = useRefreshSidemenuContext();
  const pathname = usePathname();
  const chatId = pathname.split("/")[2];

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const sendMessage = async (): Promise<void> => {
    if (input.length === 0) return;

    setMessages([...messages, { text: input, user: true }]);
    setInput("");

    const response = await fetch(`/api/chat`, {
      method: "POST",
      body: JSON.stringify({
        question: input,
        chatId: chatId === undefined ? null : chatId,
      }),
    }).then((res) => res.json());

    if (response.error) {
      window.alert(response.error);
      return;
    }

    setMessages([
      ...messages,
      { text: input, user: true },
      { text: response.answer, user: false },
    ]);
    if (chatId === undefined) {
      refreshSidemenu();
      router.push(`/chat/${response.chatId}`);
    }
  };
  const getMessageHistory = async (): Promise<void> => {
    if (chatId === undefined) return;
    const response = await fetch(`/api/chatHistory`, {
      method: "POST",
      body: JSON.stringify({ chatId: chatId }),
    }).then((res) => res.json());

    setMessages(response.messages);
  };

  useEffect(() => {
    getMessageHistory();
  }, [chatId]);

  return (
    <section className="flex max-h-full w-full flex-grow flex-col gap-4 rounded-lg bg-secondary-800 p-4">
      <div className="scrollbar flex max-h-full w-full flex-grow flex-col gap-3 overflow-y-scroll p-3">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <div className="h-[100px] w-full">
        <div className="flex h-full w-full flex-row items-center justify-center gap-4 rounded-[18px] bg-secondary-800 p-4 text-lg text-text-100 md:w-full">
          <input
            className="h-full w-full rounded-[18px] bg-secondary-700 p-4 text-lg text-text-100 focus:outline-none"
            type="text"
            placeholder="Type a message"
            onChange={(e): void => setInput(e.target.value)}
            value={input}
          />
          <button
            className="h-full w-24 cursor-pointer rounded-[18px] border-none bg-primary-600 text-text-100"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default Chat;

const Message = ({ message }: { message: IMessage }) => {
  if (message.user)
    return (
      <div className="mb-[10px] flex items-center justify-end gap-[10px]">
        <p className="text-background rounded-bl-[18px] rounded-br-[7px] rounded-tl-[18px] rounded-tr-[18px] bg-primary-600 p-[10px]">
          {message.text}
        </p>
      </div>
    );
  else
    return (
      <div className="mb-[10px] flex items-center justify-start gap-[10px]">
        <p className="rounded-bl-[7px] rounded-br-[18px] rounded-tl-[18px] rounded-tr-[18px] bg-secondary-500 p-[10px]">
          {message.text}
        </p>
      </div>
    );
};
