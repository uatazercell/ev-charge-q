"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    } finally {
      setResetLoading(false);
    }
  };

//   const handleGoogleSignIn = async () => {
//     setError("");
//     setGoogleLoading(true);
//     const provider = new GoogleAuthProvider();

//     try {
//       await signInWithPopup(auth, provider);
//       router.push("/");
//     } catch (err) {
//       setError(err.message || "Unable to sign in with Google.");
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

  return (
    <main className="container max-w-md mx-auto py-12 px-8 h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Log in</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email and password to continue.</p>
      </div>

      <form className="space-y-4 px-6 w-full" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {resetMessage && <p className="text-sm text-green-600">{resetMessage}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <div className="mt-4 flex items-center w-full px-6">
        <div className="flex-1 border-t border-slate-300"></div>
        <span className="px-3 text-sm text-slate-500">or</span>
        <div className="flex-1 border-t border-slate-300"></div>
      </div>

      {/* <div className="mt-4 w-full px-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full rounded bg-white border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center"
        >
          {googleLoading ? (
            "Signing in..."
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div> */}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={resetLoading}
          className="text-sm text-blue-600 underline disabled:opacity-50"
        >
          {resetLoading ? "Sending..." : "Forgot Password?"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account? <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
      </p>
    </main>
  );
}
