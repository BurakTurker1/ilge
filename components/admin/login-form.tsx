"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { KeyRound, Lock, UserRound } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    setLoading(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Giris basarisiz.");
      return;
    }

    router.replace(params.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md border border-white/10 bg-ink/86 p-6 shadow-glow backdrop-blur">
      <div className="mb-6">
        <div className="mb-4 grid h-12 w-12 place-items-center border border-brass/50 bg-brass/15 text-atlas">
          <KeyRound className="h-5 w-5" />
        </div>
        <p className="text-xs uppercase tracking-[0.32em] text-brass">ILGE YONETIM PANELI</p>
        <h1 className="mt-3 font-display text-4xl text-white">Admin Girisi</h1>
        <p className="mt-3 text-sm leading-6 text-white/58">Panel yalnizca yetkili kullanicilar icindir. Ilk kurulum sifresi ayarlardan degistirilebilir.</p>
      </div>
      <label className="mb-4 block">
        <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
          <UserRound className="h-4 w-4" />
          Kullanici adi
        </span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-12 w-full border border-white/10 bg-white/[0.04] px-3 text-white outline-none focus:border-brass/60"
          autoComplete="username"
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
          <Lock className="h-4 w-4" />
          Sifre
        </span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="h-12 w-full border border-white/10 bg-white/[0.04] px-3 text-white outline-none focus:border-brass/60"
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="mb-4 border border-ember/40 bg-ember/10 p-3 text-sm text-red-100">{error}</p> : null}
      <button type="submit" disabled={loading} className="w-full bg-brass px-4 py-3 text-sm font-semibold text-ink transition hover:bg-atlas disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Kontrol ediliyor..." : "Panele gir"}
      </button>
    </form>
  );
}
