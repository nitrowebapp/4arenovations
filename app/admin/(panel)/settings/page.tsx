"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/admin";

export default function AdminSettingsPage() {
  const [state, formAction, pending] = useActionState(changePassword, null);

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-extrabold text-brand">Configurações</h1>
      <p className="mt-1 text-sm text-ink/60">Trocar a senha de acesso.</p>

      <form
        action={formAction}
        className="mt-6 space-y-4 rounded-xl border border-brand/10 bg-white p-6 shadow-sm"
      >
        <input
          name="current"
          type="password"
          required
          placeholder="Senha atual"
          className="w-full rounded-md border border-brand/20 px-3 py-2.5 text-sm"
        />
        <input
          name="next"
          type="password"
          required
          minLength={8}
          placeholder="Nova senha (mín. 8 caracteres)"
          className="w-full rounded-md border border-brand/20 px-3 py-2.5 text-sm"
        />
        <input
          name="confirm"
          type="password"
          required
          placeholder="Confirmar nova senha"
          className="w-full rounded-md border border-brand/20 px-3 py-2.5 text-sm"
        />

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            Senha alterada com sucesso.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-light disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
