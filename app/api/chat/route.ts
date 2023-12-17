import { isNullOrUndefined } from "@/utils/isNullOrUndefined";
import { createClient } from "@/utils/supabase/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage } from "langchain/dist/schema";
import { PromptTemplate } from "langchain/prompts";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROMPT_TEMPLATE = `You are a budgeting helper chatbot.
You should help people to budget their money. You should be able to answer questions about budgeting.
You should be able to answer questions about budgeting.
You should be always polite and friendly.
For complex questions, you can ask for more information.
If you can't answer a question, you should ask them to ask a real professional.
Question: {question}`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json();
    if (isNullOrUndefined(body.question)) {
      return NextResponse.json(
        { error: "Please provide a question" },
        { status: 400 },
      );
    }

    if (body.chatId === undefined) {
      return NextResponse.json(
        { error: "Please provide a chatId" },
        { status: 400 },
      );
    }

    const chat = new ChatOpenAI({});
    const prompt = PromptTemplate.fromTemplate(PROMPT_TEMPLATE);
    const runnable = prompt.pipe(chat);
    const response: AIMessage = await runnable.invoke({
      question: body.question,
    });

    const answer = response.lc_kwargs.content;

    // console.log(response.lc_kwargs.content);

    // check if chat exists
    if (!body.chatId) {
      console.log("chat does not exist");
      const conversation = {
        messages: [
          {
            text: body.question,
            user: true,
          },
          {
            text: answer,
            user: false,
          },
        ],
      };
      console.log(conversation);
      const { data, error } = await supabase.from("Chats").insert({
        user_id: user?.id,
        title: body.question.substring(0, 20),
        conversation: conversation,
      });

      if (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          answer,
          chatId: body.chatId,
        },
        { status: 200 },
      );
    } else {
      const { data: chatData, error: chatError } = await supabase
        .from("Chats")
        .select("*")
        .eq("id", body.chatId);
      console.log("chat exists");
      const conversation = {
        messages: [
          ...chatData[0].conversation.messages,
          {
            text: body.question,
            user: true,
          },
          {
            text: answer,
            user: false,
          },
        ],
      };

      const { data, error } = await supabase.from("Chats").upsert({
        id: body.chatId,
        user_id: user?.id,
        title: chatData[0].title,
        conversation: conversation,
      });

      if (chatError) {
        console.log(chatError);
        return NextResponse.json({ error: chatError.message }, { status: 500 });
      }
      console.log("chat", chatData);

      if (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      {
        answer,
        chatId: body.chatId,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
