import { registerActivity } from "@/utils/registerActivity";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    registerActivity("Goals page visited");

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

    const goalsWithT = await Promise.all(
      goals?.map(async (goal) => {
        const { data: transactions, error: transactionsError } = await supabase
          .from("Transactions")
          .select("movement")
          .eq("user_id", user?.id)
          .eq("goal_id", goal.id);

        const totalAmount = transactions?.reduce((acc, curr) => {
          return acc + curr.movement;
        }, 0);

        if (transactionsError) {
          return NextResponse.json(
            { error: transactionsError.message },
            { status: 500 },
          );
        }

        return { ...goal, totalAmount };
      }) || [],
    );

    return NextResponse.json({ goals: goalsWithT }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    registerActivity("Goal created");
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 500 });
    }

    const { data: goals, error } = await supabase
      .from("Goals")
      .insert([
        {
          user_id: userId,
          title: body.title,
          description: body.description,
          goal_amount: body.goal_amount,
          category_id: body.category_id,
        },
      ])
      .select("*");

    const goalsWithT = await Promise.all(
      goals?.map(async (goal) => {
        const { data: transactions, error: transactionsError } = await supabase
          .from("Transactions")
          .select("movement")
          .eq("user_id", user?.id)
          .eq("goal_id", goal.id);

        const totalAmount = transactions?.reduce((acc, curr) => {
          return acc + curr.movement;
        }, 0);

        if (transactionsError) {
          return NextResponse.json(
            { error: transactionsError.message },
            { status: 500 },
          );
        }

        return { ...goal, totalAmount };
      }) || [],
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ goals: goalsWithT }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    registerActivity("Goal updated");
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: goals, error } = await supabase
      .from("Goals")
      .update({
        title: body.title,
        description: body.description,
        goal_amount: body.goal_amount,
        category_id: body.category_id,
      })
      .match({ id: body.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ goals }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    registerActivity("Goal deleted");
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("Goals")
      .delete()
      .match({ id: body.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
