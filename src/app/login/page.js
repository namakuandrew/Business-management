import { createSupabaseServerClient } from "@/lib/supabase/utils"; // Correct import
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function LoginPage({ searchParams }) {
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

    const host = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${host}/auth/callback` },
    });
    if (error) {
      console.error("Sign up error:", error.message);

      if (error.message.includes("User already registered")) {
        return redirect("/login?message=This email address is already in use.");
      }
      if (error.message.includes("Password should be at least 6 characters")) {
        return redirect(
          "/login?message=Password is too weak. Please use at least 6 characters."
        );
      }
      return redirect(
        "/login?message=Could not create an account. Please try again."
      );
    }
    return redirect(
      "/login?message=Please check your email to confirm your account"
    );
  };
  return (
    <div className="login-container">
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/WebSite-Background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>
      <div className="login-form">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-message">Sign in to access dashboard </p>

        {/* Notification Message */}
        {searchParams?.message && (
          <p className="notification-message">{searchParams.message}</p>
        )}

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
