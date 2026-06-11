"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/admin";
import { LogoMark } from "@/components/Logo";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center">
          <LogoMark size={56} />
          <h1 className="mt-4 text-xl font-extrabold text-brand">
            Área Administrativa
          </h1>
          <p className="text-sm text-ink/60">4A Renovation &amp; Floor LLC</p>
        </div>

        <div className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="E-mail"
            className="w-full rounded-md border border-brand/20 px-3 py-2.5 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Senha"
            className="w-full rounded-md border border-brand/20 px-3 py-2.5 text-sm"
          />
        </div>

        {state?.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-accent px-4 py-2.5 font-bold text-white hover:bg-accent-dark disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
