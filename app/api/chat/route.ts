import { isNullOrUndefined } from "@/utils/isNullOrUndefined";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { IMessage } from "@/types/types";

const SYSTEM_PROMPT: IMessage = {
  content: `You are a budgeting helper chatbot.
  You should help people to budget their money. You should be able to answer questions about budgeting.
  You should be able to answer questions about budgeting.
  You should be always polite and friendly.
  For complex questions, you can ask for more information.
  If you can't answer a question, you should ask them to ask a real professional.
  You can also redirect them to pages on the website.
  `,
  role: "system",
};

const SUMMARY_PROMPT: IMessage = {
  content:
    "Summary the transactions, please use the users original question. Units is in forints.",
  role: "assistant",
};

const getTransactions = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const { data: transactions, error } = await supabase
    .from("Transactions")
    .select("*, goal_id ( * ), category_id ( * )")
    .match({ user_id: user?.id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return transactions;
};

const getCategories = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const { data: categories, error } = await supabase
    .from("Categories")
    .select("*")
    .match({ user_id: user?.id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return categories;
};

const getGoals = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const { data: goals, error } = await supabase
    .from("Goals")
    .select("*")
    .match({ user_id: user?.id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return goals;
};

const getTransactionsByCategory = async (param: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  // get category id
  const { data: categories, error: categoriesError } = await supabase
    .from("Categories")
    .select("*")
    .match({ user_id: user?.id })
    .eq("title", param);

  if (categoriesError) {
    return NextResponse.json(
      { error: categoriesError.message },
      { status: 500 },
    );
  }

  const categoryId = categories[0].id;

  const { data: transactions, error } = await supabase
    .from("Transactions")
    .select("*, goal_id ( * ), category_id ( * )")
    .match({ user_id: user?.id })
    .eq("category_id", categoryId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return transactions;
};

const getTransactionsByGoal = async (param: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const { data: goals, error: goalsError } = await supabase
    .from("Goals")
    .select("*")
    .match({ user_id: user?.id })
    .eq("title", param);

  if (goalsError) {
    return NextResponse.json({ error: goalsError.message }, { status: 500 });
  }

  const goalId = goals[0].id;

  const { data: transactions, error } = await supabase
    .from("Transactions")
    .select("*, goal_id ( * ), category_id ( * )")
    .match({ user_id: user?.id })
    .eq("goal_id", goalId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return transactions;
};
const availableRoutes = [
  "transactions",
  "categories",
  "goals",
  "logout",
  "kpi",
];
const redirectTo = (param: string) => {
  const origin = headers().get("origin");
  if (!availableRoutes.includes(param)) {
    return "Redirecting is not available for this route";
  }

  return NextResponse.redirect(`${origin}/${param}`);
};

const functions = [
  {
    name: "getTransactions",
    description: "Get all transactions fron Supabase",
    parameters: {},
    function: async () => {
      return {
        result: await getTransactions(),
      };
    },
  },
  {
    name: "getCategories",
    description: "Get all categories fron Supabase",
    parameters: {},
    function: async () => {
      return {
        result: await getCategories(),
      };
    },
  },
  {
    name: "getGoals",
    description: "Get all goals fron Supabase",
    parameters: {},
    function: async () => {
      return {
        result: await getGoals(),
      };
    },
  },
  {
    name: "getTransactionsByCategory",
    description: "Get all transactions fron Supabase",
    parameters: {
      type: "object",
      properties: {
        param: {
          type: "string",
          description: "Category Name",
        },
      },
      required: ["param"],
    },
    function: async (parameters: { param: string }) => {
      return {
        result: await getTransactionsByCategory(parameters.param),
      };
    },
  },
  {
    name: "getTransactionsByGoal",
    description: "Get all transactions fron Supabase",
    parameters: {
      type: "object",
      properties: {
        param: {
          type: "string",
          description: "Goal Name",
        },
      },
      required: ["param"],
    },
    function: async (parameters: { param: string }) => {
      return {
        result: await getTransactionsByGoal(parameters.param),
      };
    },
  },
  {
    name: "redirectTo",
    description: "Redirect to another page",
    parameters: {
      type: "object",
      properties: {
        param: {
          type: "string",
          description: "Page Name",
        },
      },
      required: ["param"],
    },
    function: async (parameters: { param: string }) => {
      return {
        result: redirectTo(parameters.param),
      };
    },
  },
];

const availableFunctions: { [key: string]: number } = {
  getTransactions: 0,
  getCategories: 1,
  getGoals: 2,
  getTransactionsByCategory: 3,
  getTransactionsByGoal: 4,
  redirectTo: 5,
};
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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const question: IMessage = {
      role: "user",
      content: body.question,
    };

    // check if chat exists
    if (body.chatId === null) {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [SYSTEM_PROMPT, question],
        functions: functions,
        function_call: "auto",
      });

      let answer = chatCompletion.choices[0].message.content;

      answer = await useTool(chatCompletion, openai, question, answer);

      const conversation = {
        messages: [
          {
            content: body.question,
            role: "user",
          },
          {
            content: answer,
            role: "assistant",
          },
        ],
      };
      const { data, error } = await supabase
        .from("Chats")
        .insert({
          user_id: user?.id,
          title: body.question.substring(0, 20),
          conversation: conversation,
        })
        .select("id");

      body.chatId = data?.[data.length - 1].id;

      if (error) {
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

      if (chatError) {
        return NextResponse.json({ error: chatError.message }, { status: 500 });
      }

      if (chatData === null) {
        return NextResponse.json(
          { error: "Chat does not exist" },
          { status: 400 },
        );
      }

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          SYSTEM_PROMPT,
          ...chatData[0].conversation.messages,
          question,
        ],
        functions: functions,
        function_call: "auto",
      });

      let answer = chatCompletion.choices[0].message.content;

      answer = await useTool(chatCompletion, openai, question, answer);

      const conversation = {
        messages: [
          ...chatData[0].conversation.messages,
          {
            content: body.question,
            role: "user",
          },
          {
            content: answer,
            role: "assistant",
          },
        ],
      };

      const { error } = await supabase.from("Chats").upsert({
        id: body.chatId,
        user_id: user?.id,
        title: chatData[0].title,
        conversation: conversation,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(
        {
          answer,
          chatId: body.chatId,
        },
        { status: 200 },
      );
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
async function useTool(
  chatCompletion: OpenAI.Chat.Completions.ChatCompletion,
  openai: OpenAI,
  question: IMessage,
  answer: string | null,
) {
  if (chatCompletion.choices[0].message.function_call !== null) {
    const functionName = chatCompletion.choices[0].message.function_call?.name;
    if (functionName) {
      const functionId: number = availableFunctions[functionName];

      const args = JSON.parse(
        chatCompletion.choices[0].message.function_call?.arguments as string,
      );

      const function_res = await functions[functionId].function({
        param: args.param,
      });

      const results: IMessage = {
        content: JSON.stringify(function_res.result),
        role: "assistant",
      };

      const summaryCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [SUMMARY_PROMPT, question, results],
      });

      answer = summaryCompletion.choices[0].message.content;
    }
  }
  return answer;
}
