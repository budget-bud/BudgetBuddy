import { isNullOrUndefined } from "@/utils/isNullOrUndefined";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { IMessage } from "@/types/types";
import { registerActivity } from "@/utils/registerActivity";

const SYSTEM_PROMPT: IMessage = {
  content: `You are a budgeting helper chatbot.
  You should help people to budget their money. You should be able to answer questions about budgeting.
  You should be able to answer questions about budgeting.
  You should be always polite and friendly.
  For complex questions, you can ask for more information.
  If you can't answer a question, you should ask them to ask a real professional.
  You can also redirect them to pages on the website.
  You can query the database for more information with your functions.
  You can also create new transactions, categories and goals.
  `,
  role: "system",
};

const SUMMARY_PROMPT: IMessage = {
  content:
    "Summarize the transactions, please use the users original question. Units is in forints or if something was created, please say so.",
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

  if (categoriesError || categories.length === 0) {
    return "Sorry, I couldn't find any transactions for this category.";
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

  if (goalsError || goals.length === 0) {
    return "Sorry, I couldn't find any transactions for this goal.";
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

const createCategory = async (
  title: string,
  description: string,
  type: string,
  limit: number,
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const { data: categories, error } = await supabase
    .from("Categories")
    .insert([
      {
        user_id: userId,
        title: title,
        description: description,
        type: type,
        limit: limit,
      },
    ])
    .select("*");

  if (error) {
    console.log(error);
    return "Sorry, I couldn't create this category.";
  }

  console.log(categories);

  return (
    "I successfully created the category: " +
    categories[0].title +
    "-" +
    categories[0].limit
  );
};

const createGoal = async (
  title: string,
  description: string,
  goal_amount: number,
  category_name: string,
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  console.log(category_name);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  // get category id
  const { data: categories, error: categoriesError } = await supabase
    .from("Categories")
    .select("*")
    .eq("user_id", userId)
    .eq("title", category_name);

  console.log(categories);

  if (categoriesError || categories.length === 0) {
    console.log(categoriesError);
    return "Sorry, I couldn't create this goal.";
  }

  console.log(categories);
  const categoryId = categories[0].id;

  console.log(categoryId);

  const { data: goals, error } = await supabase
    .from("Goals")
    .insert([
      {
        user_id: userId,
        title: title,
        description: description,
        goal_amount: goal_amount,
        category_id: categoryId,
      },
    ])
    .select("*");

  if (error) {
    console.log(error);
    return "Sorry, I couldn't create this goal.";
  }

  console.log(goals);

  return (
    "I successfully created the goal: " +
    goals[0].title +
    "-" +
    goals[0].goal_amount
  );
};

const createTransaction = async (
  type: string,
  goal_name: string,
  category_name: string,
  origin: string,
  place: string,
  movement: string,
  description: string,
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const { data: balance, error: balanceError } = await supabase
    .from("Transactions")
    .select("base_balance")
    .eq("user_id", userId);

  if (balanceError) {
    return "Sorry, I couldn't create this transaction.";
  }

  const startBalance = balance[balance.length - 1]?.base_balance || 0;

  let goalId = null;
  let categoryId = null;

  if (goal_name) {
    const { data: goals, error: goalsError } = await supabase
      .from("Goals")
      .select("*")
      .match({ user_id: user?.id })
      .eq("title", goal_name);

    if (goalsError || goals.length === 0) {
      console.log(goalsError);
      return "Sorry, I couldn't create this transaction.";
    }
    goalId = goals[0].id;
  }

  if (category_name) {
    const { data: categories, error: categoriesError } = await supabase
      .from("Categories")
      .select("*")
      .match({ user_id: user?.id })
      .eq("title", category_name);

    if (categoriesError || categories.length === 0) {
      console.log(categoriesError);
      return "Sorry, I couldn't create this transaction.";
    }

    categoryId = categories[0].id;
  }

  const { data: transactions, error } = await supabase
    .from("Transactions")
    .insert([
      {
        type: type,
        user_id: userId,
        goal_id: goalId,
        category_id: categoryId,
        origin: origin,
        place: place,
        movement: movement,
        description: description,
        base_balance: startBalance + parseInt(movement),
      },
    ])
    .select("*");

  console.log(transactions);

  if (error) {
    console.log(error);
    return "Sorry, I couldn't create this transaction.";
  }

  return (
    "I successfully created the transaction: " +
    transactions[0].origin +
    "-" +
    transactions[0].movement
  );
};

const availableRoutes = [
  "transactions",
  "categories",
  "goals",
  "plots",
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
  {
    name: "createCategory",
    description: "Create a new category",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Category Name",
        },
        description: {
          type: "string",
          description: "Category Description",
        },
        type: {
          type: "string",
          description: "Category Type",
        },
        limit: {
          type: "number",
          description: "Category Limit",
        },
      },
      required: ["title", "type", "limit"],
    },
    function: async (parameters: {
      title: string;
      description: string;
      type: string;
      limit: number;
    }) => {
      return {
        result: await createCategory(
          parameters.title,
          parameters.description,
          parameters.type,
          parameters.limit,
        ),
      };
    },
  },
  {
    name: "createGoal",
    description: "Create a new goal",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Goal Name",
        },
        description: {
          type: "string",
          description: "Goal Description",
        },
        goal_amount: {
          type: "number",
          description: "Goal Amount",
        },
        category_name: {
          type: "number",
          description: "Category Name",
        },
      },
      required: ["title", "goal_amount", "category_name"],
    },
    function: async (parameters: {
      title: string;
      description: string;
      goal_amount: number;
      category_name: string;
    }) => {
      return {
        result: await createGoal(
          parameters.title,
          parameters.description,
          parameters.goal_amount,
          parameters.category_name,
        ),
      };
    },
  },
  {
    name: "createTransaction",
    description: "Create a new transaction",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "Transaction Type (cash or bank)",
        },
        goal_name: {
          type: "string",
          description: "Goal Name",
        },
        category_name: {
          type: "string",
          description: "Category Name",
        },
        origin: {
          type: "string",
          description: "Transaction Origin (for example: salary, or xy shop)",
        },
        place: {
          type: "string",
          description: "Transaction Place (location)",
        },
        movement: {
          type: "number",
          description:
            "Transaction Movement (negative or positive amount of money)",
        },
        description: {
          type: "string",
          description: "Transaction Description",
        },
      },
      required: ["type", "origin", "movement"],
    },
    function: async (parameters: {
      type: string;
      goal_name: string;
      category_name: string;
      origin: string;
      place: string;
      movement: string;
      description: string;
    }) => {
      return {
        result: await createTransaction(
          parameters.type,
          parameters.goal_name,
          parameters.category_name,
          parameters.origin,
          parameters.place,
          parameters.movement,
          parameters.description,
        ),
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
  createCategory: 6,
  createGoal: 7,
  createTransaction: 8,
};
export async function POST(req: NextRequest) {
  try {
    registerActivity("Chatbot asked question");

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
    console.log(chatCompletion.choices[0]);
    registerActivity("Chatbot used tool");
    const functionName = chatCompletion.choices[0].message.function_call?.name;
    if (functionName) {
      const functionId: number = availableFunctions[functionName];
      console.log(functionId);

      const args = JSON.parse(
        chatCompletion.choices[0].message.function_call?.arguments as string,
      );

      const function_res = await functions[functionId].function({
        ...args,
      });

      console.log(function_res.result);

      const results: IMessage = {
        content: JSON.stringify(function_res.result),
        role: "assistant",
      };

      if (
        function_res.result.toString().includes("successfully") ||
        function_res.result.toString().includes("couldn't")
      ) {
        answer = function_res.result.toString();
      } else {
        const summaryCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [SUMMARY_PROMPT, question, results],
        });

        answer = summaryCompletion.choices[0].message.content;
      }
    }
  }
  return answer;
}
