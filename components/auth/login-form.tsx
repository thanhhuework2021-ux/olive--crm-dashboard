'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

 async function handleLogin() {
  const supabase = createClient();

  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  console.log("SESSION:", data.session);
  console.log("USER:", data.user);

  if (error) {
    alert(error.message);
    return;
  }

  router.replace("/");
  router.refresh();
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h1 className="mb-2 text-center text-3xl font-bold">
          OLIVE ERP
        </h1>

        <p className="mb-6 text-center text-slate-400">
          Đăng nhập hệ thống
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-black"
        >
          {loading
            ? 'Đang đăng nhập...'
            : 'Đăng nhập'}
        </button>

      </div>
    </div>
  )
}