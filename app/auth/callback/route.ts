import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let redirectTo = origin;

      if (redirectTo.endsWith(":80")) {
        redirectTo = redirectTo.slice(0, -3);
      }
      return NextResponse.redirect(`${redirectTo}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/login?message=Could not authenticate user`,
  );
}
