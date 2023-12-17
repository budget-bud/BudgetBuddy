import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  const signInWithAzure = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "openid profile email",
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=" + error.message);
    }

    return redirect(data.url);
  };

  const signInWithGoogle = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=" + error.message);
    }

    return redirect(data.url);
  };

  const signInWithGitHub = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=" + error.message);
    }

    return redirect(data.url);
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: formData.get("name"),
        },
      },
    });

    if (error) {
      return redirect("/login?message=" + error.message);
    }

    return redirect("/");
  };

  return (
    <div className="animate-in bg-secondary_900 container mx-auto flex max-h-fit max-w-2xl flex-1 flex-col gap-2 rounded p-6 text-background-950">
      <form className="flex flex-col gap-2" action={signIn}>
        <label className="text-xl" htmlFor="name">
          How should we call you?
        </label>
        <input
          className="mb-6 rounded-md border border-gray-900 bg-inherit px-4 py-2"
          name="name"
          placeholder="John Doe"
          required
        />
        <label className="text-xl" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border border-gray-900 bg-inherit px-4 py-2"
          name="email"
          placeholder="username@example.com"
          required
        />
        <label className="text-xl" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border border-gray-900 bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground">
          Sign In
        </button>
        <button
          formAction={signUp}
          className="mb-2 rounded-md border border-gray-800 px-4 py-2"
        >
          Sign Up
        </button>

        {searchParams?.message && (
          <p className="bg-error_200 text-secondary_900 rounded p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
      <form>
        <div className="mt-2 flex gap-2">
          <button
            className="flex-1 rounded border border-gray-800 p-2"
            formAction={signInWithGoogle}
          >
            <GoogleIcon />
          </button>
          <button
            className="flex-1 rounded border border-gray-800 p-2"
            formAction={signInWithAzure}
          >
            <MicrosoftIcon />
          </button>
          <button
            className="flex-1 rounded border border-gray-800 p-2"
            formAction={signInWithGitHub}
          >
            <GitHubIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
