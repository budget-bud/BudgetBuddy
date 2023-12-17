import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

const protectedRoutes = [
  "/chat",
  "/plots",
  "/goals",
  "/categories",
  "/transactions",
];

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession();

    const { origin } = new URL(request.url);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (
      !user &&
      protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route),
      )
    ) {
      return NextResponse.redirect(`${origin}/login`);
    }

    if (!user) return response;

    const formattedDate = new Date().toISOString().split("T")[0];
    const url = new URL(request.nextUrl);
    if (url.pathname.includes("_next") || url.pathname.includes("/api"))
      return response;

    const { error } = await supabase
      .from("UserActivity")
      .insert({
        user_id: user?.id,
        event_date: formattedDate,
        event_type: "visited: " + url.pathname,
      })
      .select();

    if (error) {
      console.error("Activity registration failed:", error);
      return response;
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}
