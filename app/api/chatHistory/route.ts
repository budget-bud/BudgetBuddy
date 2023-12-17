import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    //get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (body.chatId === undefined) {
      const { data, error } = await supabase
        .from("Chats")
        .insert({
          user_id: user?.id,
          title: "New Chat",
          conversation: {},
        })
        .select("id");

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          chatId: data[0].id,
        },
        { status: 200 },
      );
    } else {
      const { data, error } = await supabase
        .from("Chats")
        .select("*")
        .eq("id", body.chatId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        {
          messages: data[0]?.conversation.messages ?? [],
        },
        { status: 200 },
      );
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
