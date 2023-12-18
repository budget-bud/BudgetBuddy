import { registerActivity } from "@/utils/registerActivity";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    registerActivity("Queried balance");
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const { data: balance, error: balanceError } = await supabase
      .from("Transactions")
      .select("base_balance, movement")
      .eq("user_id", user?.id);

    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 },
      );
    }

    const balanceAmount =
      isNaN(balance?.[0]?.base_balance + balance?.[0]?.movement) === true
        ? 0
        : balance?.[0]?.base_balance + balance?.[0]?.movement;

    return NextResponse.json(
      {
        balance: balanceAmount,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
