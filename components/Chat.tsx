"use client";
import { IMessage } from "@/types/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Chat = () => {
  const pathname = usePathname();
  const chatId = pathname.split("/")[2];

  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<IMessage[]>([])

  const sendMessage = (): void => {
    //TODO: send message to backend
    if (input.length > 0) {
      setMessages([...messages, { text: input, user: true }])
      setInput('')
    }
  }

  useEffect(() => {
    //TODO: fetch messages from backend
    const msgs = [
      { text: 'Hello!', user: true },
      { text: 'Hi!', user: false },
      { text: 'How are you?', user: true },
      { text: 'Good, you?', user: false },
      { text: 'I am good too!', user: true },
      {
        text: 'That is great to hear! I have a story to tell you. Once upon a time, there was a little girl named Goldilocks. She went for a walk in the forest. Pretty soon, she came upon a house. She knocked and, when no one answered, she walked right in. At the table in the kitchen, there were three bowls of porridge. Goldilocks was hungry. She tasted the porridge from the first bowl. "This porridge is too hot!" she exclaimed. So, she tasted the porridge from the second bowl. "This porridge is too cold," she said. So, she tasted the last bowl of porridge. "Ahhh, this porridge is just right," she said happily and she ate it all up. After shed eaten the three bears breakfasts, she decided she was feeling a little tired. So, she walked into the living room where she saw three chairs. Goldilocks sat in the first chair to rest her feet. This chair is too big! she exclaimed. So she sat in the second chair. This chair is too big, too! she whined. So she tried the last and smallest chair. Ahhh, this chair is just right, she sighed. But just as she settled down into the chair to rest, it broke into pieces! Goldilocks was very tired by this time, so she went upstairs to the bedroom. She lay down in the first bed, but it was too hard. Then she lay in the second bed, but it was too soft. Then she lay down in the third bed and it was just right. Goldilocks fell asleep. As she was sleeping, the three bears came home. Someones been eating my porridge, growled the Papa bear. Someones been eating my porridge, said the Mama bear. Someones been eating my porridge and they ate it all up! cried the Baby bear. Someones been sitting in my chair, growled the Papa bear. Someones been sitting in my chair, said the Mama bear. Someones been sitting in my chair and theyve broken it all to pieces, cried the Baby bear. They decided to look around some more and when they got upstairs to the bedroom, Papa bear growled, Someones been sleeping in my bed. Someones been sleeping in my bed, too said the Mama bear. Someones been sleeping in my bed and shes still there! exclaimed Baby bear. Just then, Goldilocks woke up and saw the three bears. She screamed, Help! And she jumped up and ran out of the room. Goldilocks ran down the stairs, opened the door, and ran away into the forest. And she never returned to the home of the three bears. The end.',
        user: false
      },
      {
        text: 'That is great to hear! I have a story to tell you. Once upon a time, there was a little girl named Goldilocks. She went for a walk in the forest. Pretty soon, she came upon a house. She knocked and, when no one answered, she walked right in. At the table in the kitchen, there were three bowls of porridge. Goldilocks was hungry. She tasted the porridge from the first bowl. "This porridge is too hot!" she exclaimed. So, she tasted the porridge from the second bowl. "This porridge is too cold," she said. So, she tasted the last bowl of porridge. "Ahhh, this porridge is just right," she said happily and she ate it all up. After shed eaten the three bears breakfasts, she decided she was feeling a little tired. So, she walked into the living room where she saw three chairs. Goldilocks sat in the first chair to rest her feet. This chair is too big! she exclaimed. So she sat in the second chair. This chair is too big, too! she whined. So she tried the last and smallest chair. Ahhh, this chair is just right, she sighed. But just as she settled down into the chair to rest, it broke into pieces! Goldilocks was very tired by this time, so she went upstairs to the bedroom. She lay down in the first bed, but it was too hard. Then she lay in the second bed, but it was too soft. Then she lay down in the third bed and it was just right. Goldilocks fell asleep. As she was sleeping, the three bears came home. Someones been eating my porridge, growled the Papa bear. Someones been eating my porridge, said the Mama bear. Someones been eating my porridge and they ate it all up! cried the Baby bear. Someones been sitting in my chair, growled the Papa bear. Someones been sitting in my chair, said the Mama bear. Someones been sitting in my chair and theyve broken it all to pieces, cried the Baby bear. They decided to look around some more and when they got upstairs to the bedroom, Papa bear growled, Someones been sleeping in my bed. Someones been sleeping in my bed, too said the Mama bear. Someones been sleeping in my bed and shes still there! exclaimed Baby bear. Just then, Goldilocks woke up and saw the three bears. She screamed, Help! And she jumped up and ran out of the room. Goldilocks ran down the stairs, opened the door, and ran away into the forest. And she never returned to the home of the three bears. The end.',
        user: false
      },
      {
        text: 'That is great to hear! I have a story to tell you. Once upon a time, there was a little girl named Goldilocks. She went for a walk in the forest. Pretty soon, she came upon a house. She knocked and, when no one answered, she walked right in. At the table in the kitchen, there were three bowls of porridge. Goldilocks was hungry. She tasted the porridge from the first bowl. "This porridge is too hot!" she exclaimed. So, she tasted the porridge from the second bowl. "This porridge is too cold," she said. So, she tasted the last bowl of porridge. "Ahhh, this porridge is just right," she said happily and she ate it all up. After shed eaten the three bears breakfasts, she decided she was feeling a little tired. So, she walked into the living room where she saw three chairs. Goldilocks sat in the first chair to rest her feet. This chair is too big! she exclaimed. So she sat in the second chair. This chair is too big, too! she whined. So she tried the last and smallest chair. Ahhh, this chair is just right, she sighed. But just as she settled down into the chair to rest, it broke into pieces! Goldilocks was very tired by this time, so she went upstairs to the bedroom. She lay down in the first bed, but it was too hard. Then she lay in the second bed, but it was too soft. Then she lay down in the third bed and it was just right. Goldilocks fell asleep. As she was sleeping, the three bears came home. Someones been eating my porridge, growled the Papa bear. Someones been eating my porridge, said the Mama bear. Someones been eating my porridge and they ate it all up! cried the Baby bear. Someones been sitting in my chair, growled the Papa bear. Someones been sitting in my chair, said the Mama bear. Someones been sitting in my chair and theyve broken it all to pieces, cried the Baby bear. They decided to look around some more and when they got upstairs to the bedroom, Papa bear growled, Someones been sleeping in my bed. Someones been sleeping in my bed, too said the Mama bear. Someones been sleeping in my bed and shes still there! exclaimed Baby bear. Just then, Goldilocks woke up and saw the three bears. She screamed, Help! And she jumped up and ran out of the room. Goldilocks ran down the stairs, opened the door, and ran away into the forest. And she never returned to the home of the three bears. The end.',
        user: false
      },
      {
        text: 'That is great to hear! I have a story to tell you. Once upon a time, there was a little girl named Goldilocks. She went for a walk in the forest. Pretty soon, she came upon a house. She knocked and, when no one answered, she walked right in. At the table in the kitchen, there were three bowls of porridge. Goldilocks was hungry. She tasted the porridge from the first bowl. "This porridge is too hot!" she exclaimed. So, she tasted the porridge from the second bowl. "This porridge is too cold," she said. So, she tasted the last bowl of porridge. "Ahhh, this porridge is just right," she said happily and she ate it all up. After shed eaten the three bears breakfasts, she decided she was feeling a little tired. So, she walked into the living room where she saw three chairs. Goldilocks sat in the first chair to rest her feet. This chair is too big! she exclaimed. So she sat in the second chair. This chair is too big, too! she whined. So she tried the last and smallest chair. Ahhh, this chair is just right, she sighed. But just as she settled down into the chair to rest, it broke into pieces! Goldilocks was very tired by this time, so she went upstairs to the bedroom. She lay down in the first bed, but it was too hard. Then she lay in the second bed, but it was too soft. Then she lay down in the third bed and it was just right. Goldilocks fell asleep. As she was sleeping, the three bears came home. Someones been eating my porridge, growled the Papa bear. Someones been eating my porridge, said the Mama bear. Someones been eating my porridge and they ate it all up! cried the Baby bear. Someones been sitting in my chair, growled the Papa bear. Someones been sitting in my chair, said the Mama bear. Someones been sitting in my chair and theyve broken it all to pieces, cried the Baby bear. They decided to look around some more and when they got upstairs to the bedroom, Papa bear growled, Someones been sleeping in my bed. Someones been sleeping in my bed, too said the Mama bear. Someones been sleeping in my bed and shes still there! exclaimed Baby bear. Just then, Goldilocks woke up and saw the three bears. She screamed, Help! And she jumped up and ran out of the room. Goldilocks ran down the stairs, opened the door, and ran away into the forest. And she never returned to the home of the three bears. The end.',
        user: false
      },
      {
        text: 'That is great to hear! I have a story to tell you. Once upon a time, there was a little girl named Goldilocks. She went for a walk in the forest. Pretty soon, she came upon a house. She knocked and, when no one answered, she walked right in. At the table in the kitchen, there were three bowls of porridge. Goldilocks was hungry. She tasted the porridge from the first bowl. "This porridge is too hot!" she exclaimed. So, she tasted the porridge from the second bowl. "This porridge is too cold," she said. So, she tasted the last bowl of porridge. "Ahhh, this porridge is just right," she said happily and she ate it all up. After shed eaten the three bears breakfasts, she decided she was feeling a little tired. So, she walked into the living room where she saw three chairs. Goldilocks sat in the first chair to rest her feet. This chair is too big! she exclaimed. So she sat in the second chair. This chair is too big, too! she whined. So she tried the last and smallest chair. Ahhh, this chair is just right, she sighed. But just as she settled down into the chair to rest, it broke into pieces! Goldilocks was very tired by this time, so she went upstairs to the bedroom. She lay down in the first bed, but it was too hard. Then she lay in the second bed, but it was too soft. Then she lay down in the third bed and it was just right. Goldilocks fell asleep. As she was sleeping, the three bears came home. Someones been eating my porridge, growled the Papa bear. Someones been eating my porridge, said the Mama bear. Someones been eating my porridge and they ate it all up! cried the Baby bear. Someones been sitting in my chair, growled the Papa bear. Someones been sitting in my chair, said the Mama bear. Someones been sitting in my chair and theyve broken it all to pieces, cried the Baby bear. They decided to look around some more and when they got upstairs to the bedroom, Papa bear growled, Someones been sleeping in my bed. Someones been sleeping in my bed, too said the Mama bear. Someones been sleeping in my bed and shes still there! exclaimed Baby bear. Just then, Goldilocks woke up and saw the three bears. She screamed, Help! And she jumped up and ran out of the room. Goldilocks ran down the stairs, opened the door, and ran away into the forest. And she never returned to the home of the three bears. The end.',
        user: false
      },
      { text: 'That is good!', user: false },
      { text: 'I have to go now, bye!', user: true },
      { text: 'Bye!', user: false }
    ]
    setMessages(msgs)
  }, [chatId])

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
          <button
            className="chat__input__send"
            onClick={sendMessage}
          >Send</button>
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
