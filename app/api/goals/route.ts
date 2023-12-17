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

    const { data: goals, error } = await supabase
      .from("Goals")
      .select("*")
      .match({ user_id: user?.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ goals }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: goals, error } = await supabase.from("Goals").insert([
      {
        user_id: body.user_id,
        title: body.title,
        description: body.description,
        goal_amount: body.goal_amount,
        category_id: body.category_id,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ goals }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
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
