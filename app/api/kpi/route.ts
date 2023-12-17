import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { count: allTransCount, error: allTransErr } = await supabase
      .from("Transactions")
      .select("*", { count: "exact", head: true });
    if (allTransErr) {
      return NextResponse.json({ error: allTransErr.message }, { status: 500 });
    }

    const { count: allChatsCount, error: allChatErr } = await supabase
      .from("Chats")
      .select("*", { count: "exact", head: true });
    if (allChatErr) {
      return NextResponse.json({ error: allChatErr.message }, { status: 500 });
    }

    const { count: allUsersCount, error: allUsersErr } = await supabase
      .from("UserInfo")
      .select("id", { count: "exact", head: true });
    if (allUsersErr) {
      return NextResponse.json({ error: allUsersErr.message }, { status: 500 });
    }

    const { data: weeklyKPI, error: weeklyKPIErr } =
      await supabase.rpc("get_weekly_kpi");
    if (weeklyKPIErr) {
      return NextResponse.json(
        { error: weeklyKPIErr.message },
        { status: 500 },
      );
    }

    const { data: dailyKPI, error: dailyKPIErr } =
      await supabase.rpc("get_daily_kpi");
    if (dailyKPIErr) {
      return NextResponse.json({ error: dailyKPIErr.message }, { status: 500 });
    }

    return NextResponse.json(
      { allTransCount, allUsersCount, allChatsCount, weeklyKPI, dailyKPI },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
