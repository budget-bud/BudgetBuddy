import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    //get balance
    const { data, error: balanceError } = await supabase
      .from("UserInfo")
      .select("balance")
      .eq("user_id", user?.id);

    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 },
      );
    }

    const {data: chats, error: chatsError} = await supabase
      .from("Chats")
      .select("id, title")
      .eq("user_id", user?.id);

    if (chatsError) {
      return NextResponse.json(
        { error: chatsError.message },
        { status: 500 },
      );
    }


    return NextResponse.json(
      {
        name: user?.user_metadata.full_name ?? "User",
        //profileImage: "https://i.pravatar.cc/300",
        balance: data[0].balance,
        chats: chats,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
