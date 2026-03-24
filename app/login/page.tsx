"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
      >
        <h1 className="text-2xl font-semibold">Owner login</h1>
        <p className="mt-2 text-sm text-white/70">
          Sign in to manage the enchanted forest.
        </p>

        <input
          className="mt-6 w-full rounded-xl bg-white/10 px-4 py-3 outline-none"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl bg-white/10 px-4 py-3 outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="mt-4 w-full rounded-xl bg-white px-4 py-3 font-medium text-slate-950">
          Sign in
        </button>

        {message ? <p className="mt-4 text-sm text-red-300">{message}</p> : null}
      </form>
    </main>
  );
}