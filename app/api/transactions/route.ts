import { registerActivity } from "@/utils/registerActivity";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    registerActivity("Transactions page visited");

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

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    registerActivity("Transaction created");
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

    const { data: balance, error: balanceError } = await supabase
      .from("Transactions")
      .select("base_balance")
      .eq("user_id", userId);

    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 },
      );
    }

    const startBalance = balance[balance.length - 1]?.base_balance || 0;

    const { data: transactions, error } = await supabase
      .from("Transactions")
      .insert([
        {
          type: body.type,
          user_id: userId,
          goal_id: body.goal_id,
          category_id: body.category_id,
          origin: body.origin,
          place: body.place,
          movement: body.movement,
          description: body.description,
          base_balance: startBalance + parseInt(body.movement),
        },
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    registerActivity("Transaction updated");
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

    const { data: transactions, error } = await supabase
      .from("Transactions")
      .update({
        user_id: userId,
        goal_id: body.goal_id,
        category_id: body.category_id,
        origin: body.origin,
        place: body.place,
        movement: body.movement,
        description: body.description,
      })
      .match({ id: body.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    registerActivity("Transaction deleted");
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: transactions, error } = await supabase
      .from("Transactions")
      .delete()
      .match({ id: body.id })
      .select("*, goal_id ( * ), category_id ( * )")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
