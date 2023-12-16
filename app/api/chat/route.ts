import { isNullOrUndefined } from "@/utils/isNullOrUndefined";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage } from "langchain/dist/schema";
import { PromptTemplate } from "langchain/prompts";
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

    console.log(response.lc_kwargs.content);

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
