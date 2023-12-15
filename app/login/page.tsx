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

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "openid profile email",
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect(data.url);
  };

  const signInWithGoogle = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect(data.url);
  };

  const signInWithGitHub = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
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
    <div className="animate-in flex-1 flex flex-col rounded max-h-fit mx-auto container max-w-2xl gap-2 text-black bg-secondary_900 p-6">
      <form className="flex flex-col gap-2" action={signIn}>
        <label className="text-xl" htmlFor="name">
          How should we call you?
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-gray-900 mb-6"
          name="name"
          placeholder="John Doe"
          required
        />
        <label className="text-xl" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-gray-900 mb-6"
          name="email"
          placeholder="username@example.com"
          required
        />
        <label className="text-xl" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-gray-900 mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Sign In
        </button>
        <button
          formAction={signUp}
          className="border border-gray-800 rounded-md px-4 py-2 mb-2"
        >
          Sign Up
        </button>

        {searchParams?.message && (
          <p className="p-4 bg-error_200 rounded text-secondary_900 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
      <form>
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 p-2 border rounded border-gray-800"
            formAction={signInWithGoogle}
          >
            <GoogleIcon />
          </button>
          <button
            className="flex-1 p-2 border rounded border-gray-800"
            formAction={signInWithAzure}
          >
            <MicrosoftIcon />
          </button>
          <button
            className="flex-1 p-2 border rounded border-gray-800"
            formAction={signInWithGitHub}
          >
            <GitHubIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
