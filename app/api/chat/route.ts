import { ChatOpenAI } from "langchain/chat_models/openai";
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
    const chat = new ChatOpenAI({});
    const prompt = PromptTemplate.fromTemplate(PROMPT_TEMPLATE);
    const runnable = prompt.pipe(chat);
    console.log(body.question);
    const response = await runnable.invoke({
      question: body.question,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
