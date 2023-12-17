import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (body.chatId === undefined) {
      const { error } = await supabase.from("Chats").insert({
        user_id: body.user_id,
        title: body.title,
        conversation: body.conversation,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          messages: [body.conversation] ?? [],
        },
        { status: 200 },
      );
    }

    const { data, error } = await supabase
      .from("Chats")
      .select("*")
      .eq("id", body.chatId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        messages: [data[0]?.conversation] ?? [],
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
