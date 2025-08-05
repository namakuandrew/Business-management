import { createSupabaseServerClient } from "@/lib/supabase/utils"; // Correct import
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function LoginPage() {
  const signIn = async (FormData) => {
    "use server";
    const email = FormData.get("email");
    const password = FormData.get("password");
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return redirect("/login?message=Could not authenticate User");
    }
    return redirect("/");
  };

  const signUp = async (FormData) => {
    "use server";
    const email = FormData.get("email");
    const password = FormData.get("password");
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: "http://localhost:3000/auth/callback" },
    });
    if (error) {
      return redirect("/login?message=Could not create User");
    }
    return redirect(
      "/login?message=Please check your email to confirm your account"
    );
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Login</h1>
        <p className="login-message">Sign in or create an account</p>
        <form>
          <label htmlFor="email">Email:</label>
          <input name="email" placeholder="you@example.com" required />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            required
          />
          <button formAction={signIn}>Sign in</button>
          <button formAction={signUp} className="secondary">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
