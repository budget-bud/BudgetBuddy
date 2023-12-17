import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
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
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: transactions, error } = await supabase
      .from("Transactions")
      .insert([
        {
          user_id: body.user_id,
          goal_id: body.goal_id,
          category_id: body.category_id,
          origin: body.origin,
          place: body.place,
          movement: body.movement,
          description: body.description,
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
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: transactions, error } = await supabase
      .from("Transactions")
      .update({
        user_id: body.user_id,
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
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: transactions, error } = await supabase
      .from("Transactions")
      .delete()
      .match({ id: body.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
