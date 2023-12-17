"use client";
import { IMessage } from "@/types/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Chat = () => {
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

    setMessages([
      ...messages,
      { text: input, user: true },
      { text: response.answer, user: false },
    ]);
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
    <section className="w-full max-h-full p-4 bg-primary_200 rounded-lg flex flex-col flex-grow gap-4">
      <div className="w-full max-h-full flex flex-col flex-grow overflow-y-scroll p-3 gap-3 scrollbar">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <div className="h-[100px] w-full">
        <div className="chat__input__text">
          <input
            className="chat__input__field"
            type="text"
            placeholder="Type a message"
            onChange={(e): void => setInput(e.target.value)}
            value={input}
          />
          <button className="chat__input__send" onClick={sendMessage}>
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
      <div className="message--user">
        <p className="message--user__text">{message.text}</p>
      </div>
    );
  else
    return (
      <div className="message--system">
        <p className="message--system__text">{message.text}</p>
      </div>
    );
};
