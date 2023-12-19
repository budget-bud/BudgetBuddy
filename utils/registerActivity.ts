import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { NextResponse } from "next/server";

export const registerActivity = async (activity: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 });
  }

  const formattedDate = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("UserActivity")
    .insert({
      user_id: user?.id,
      event_date: formattedDate,
      event_type: activity,
    })
    .select();

  if (error) {
    console.error("Activity registration failed:", error);
  }
};
