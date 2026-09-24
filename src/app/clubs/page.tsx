import Link from "next/link";
import { logger } from "@/lib/observability/logger";
import { createClient } from "@/lib/supabase/server";

const illustrationStyles = [
  {
    tone: "from-orange-300 via-amber-100 to-sky-100",
    court: "bg-orange-600",
    lines: "border-amber-100/90",
    accent: "bg-orange-100 text-orange-800",
  },
  {
    tone: "from-emerald-300 via-teal-100 to-sky-100",
    court: "bg-emerald-700",
    lines: "border-emerald-100/90",
    accent: "bg-emerald-100 text-emerald-800",
  },
  {
    tone: "from-sky-300 via-cyan-100 to-slate-100",
    court: "bg-sky-700",
    lines: "border-sky-100/90",
    accent: "bg-sky-100 text-sky-800",
  },
];

function CourtIllustration({
  tone,
  court,
  lines,
}: Pick<(typeof illustrationStyles)[number], "tone" | "court" | "lines">) {
  return (
    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${tone}`}>
      <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full border-[18px] border-white/35" />
      <div className="absolute -bottom-11 -left-7 h-32 w-32 rounded-full border-[18px] border-white/30" />
      <div
        className={`absolute left-1/2 top-1/2 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rounded-md ${court} shadow-xl shadow-black/10`}
      >
        <div className={`absolute inset-3 border ${lines}`} />
        <div className={`absolute bottom-3 left-1/2 top-3 border-l ${lines}`} />
        <div className={`absolute left-3 right-3 top-1/2 border-t ${lines}`} />
        <div
          className={`absolute left-3 right-3 top-[32%] border-t ${lines}`}
        />
        <div
          className={`absolute bottom-[32%] left-3 right-3 border-t ${lines}`}
        />
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
        Foto del club
      </span>
    </div>
  );
}

export default async function ClubsPage() {
  const supabase = await createClient();
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("id, name, description, address, courts (id, surface_type, price)")
    .eq("active", true)
    .order("name");

  if (error) {
    logger.error("Failed to load active clubs", error, {
      operation: "clubs.list",
    });
  }

  const hasClubs = !error && clubs && clubs.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f8f5]">
      <header className="border-b border-stone-200/80 bg-[#f8f8f5]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            className="text-xl font-bold tracking-tight text-emerald-800"
            href="/"
          >
            cancha
          </Link>
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-7 text-sm font-medium text-stone-600 sm:flex"
          >
            <Link className="text-emerald-800" href="/clubs">
              Explorar
            </Link>
            <Link
              className="transition hover:text-emerald-800"
              href="/reservations"
            >
              Mis reservas
            </Link>
          </nav>
          <Link
            className="rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
            href="/login"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Tenis en Quito
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Explora canchas para jugar hoy.
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Encuentra el club que te queda mejor, revisa sus canchas y reserva
            tu horario.
          </p>
        </div>

        <section
          aria-label="Filtros de búsqueda"
          className="mt-7 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:flex sm:items-center sm:gap-3 sm:p-4"
        >
          <label className="flex flex-1 items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 text-stone-500">
            <svg
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-500"
              placeholder="Busca por club o zona"
              type="search"
            />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 sm:mt-0">
            <button
              className="shrink-0 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
              type="button"
            >
              Hoy <span aria-hidden="true">⌄</span>
            </button>
            <button
              className="shrink-0 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
              type="button"
            >
              Todos los horarios <span aria-hidden="true">⌄</span>
            </button>
            <button
              className="shrink-0 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
              type="button"
            >
              Filtros
            </button>
          </div>
        </section>

        <div className="mt-9 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Canchas disponibles
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {hasClubs
                ? `${clubs.length} ${clubs.length === 1 ? "club disponible" : "clubes disponibles"}`
                : "Clubes disponibles próximamente"}
            </p>
          </div>
          <button
            className="text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4"
            type="button"
          >
            Ordenar por cercanía
          </button>
        </div>

        <section className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {error ? (
            <div
              className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"
              role="alert"
            >
              <h3 className="text-lg font-bold text-red-900">
                No pudimos cargar los clubes
              </h3>
              <p className="mt-2 text-sm leading-6 text-red-700">
                Inténtalo de nuevo en unos minutos.
              </p>
            </div>
          ) : hasClubs ? (
            clubs.map((club, index) => {
              const style =
                illustrationStyles[index % illustrationStyles.length];
              const courts = club.courts ?? [];
              const surfaces = [
                ...new Set(courts.map((court) => court.surface_type)),
              ];
              const lowestPrice = courts.reduce<number | null>(
                (lowest, court) => {
                  const price = Number(court.price);
                  return lowest === null || price < lowest ? price : lowest;
                },
                null,
              );

              return (
                <article
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  key={club.id}
                >
                  <CourtIllustration {...style} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-stone-900">
                          {club.name}
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">
                          {club.address}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${style.accent}`}
                      >
                        {courts.length} canchas
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                      <span className="text-sm text-stone-600">
                        {surfaces.join(" · ") || "Canchas próximamente"}
                      </span>
                      {lowestPrice !== null && (
                        <span className="shrink-0 text-sm font-semibold text-stone-900">
                          Desde ${lowestPrice.toFixed(2)}
                          <span className="font-normal text-stone-500">
                            {" "}
                            / hora
                          </span>
                        </span>
                      )}
                    </div>
                    <Link
                      className="mt-5 block rounded-xl bg-emerald-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-900"
                      href={`/availability?club=${encodeURIComponent(club.id)}`}
                    >
                      Ver disponibilidad
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
              <h3 className="text-lg font-bold text-stone-900">
                Aún no hay clubes disponibles
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Vuelve pronto para descubrir canchas de tenis en Quito.
              </p>
            </div>
          )}
        </section>

        <aside className="mt-10 rounded-2xl bg-emerald-900 px-5 py-6 text-white sm:flex sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-lg font-bold">¿Tienes un club de tenis?</p>
            <p className="mt-1 text-sm text-emerald-100">
              Publica tus canchas y recibe reservas desde cancha.
            </p>
          </div>
          <Link
            className="mt-4 inline-block rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 sm:mt-0"
            href="/conoce-mas"
          >
            Conoce más
          </Link>
        </aside>
      </main>
    </div>
  );
}
