"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callbackError = searchParams.get("error");

  async function signInWithGoogle() {
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError("No pudimos iniciar sesión con Google. Inténtalo nuevamente.");
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5] px-5 py-10 sm:px-8">
      <section className="w-full max-w-md" aria-labelledby="login-title">
        <Link className="inline-block text-xl font-bold tracking-tight text-emerald-800" href="/">
          cancha
        </Link>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Bienvenido</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900" id="login-title">
            Inicia sesión para reservar
          </h1>
          <p className="mt-3 leading-7 text-stone-600">
            Guarda tus reservas y agenda tu próxima cancha en Quito.
          </p>

          <button
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={signInWithGoogle}
            type="button"
          >
            <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-[#4285f4] text-xs font-bold text-white">G</span>
            {isLoading ? "Redirigiendo a Google..." : "Continuar con Google"}
          </button>

          {(error || callbackError) && <p className="mt-4 text-sm font-medium text-red-700" role="alert">{error ?? "No pudimos completar el inicio de sesión. Inténtalo nuevamente."}</p>}

          <p className="mt-7 text-center text-sm leading-6 text-stone-500">
            Al continuar, aceptas que usemos tu cuenta para gestionar tus reservas.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-stone-600">
          ¿Quieres conocer las canchas antes?{" "}
          <Link className="font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950" href="/clubs">
            Explorar clubes
          </Link>
        </p>
      </section>
    </main>
  );
}
