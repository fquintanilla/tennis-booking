import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Publica tus canchas",
    description:
      "Comparte la información esencial de tu club, tus canchas y sus horarios disponibles.",
  },
  {
    number: "02",
    title: "Recibe reservas claras",
    description:
      "Los jugadores eligen un horario disponible y reciben la confirmación de su reserva.",
  },
  {
    number: "03",
    title: "Gestiona tu operación",
    description:
      "Consulta reservas, actualiza disponibilidad y bloquea horarios cuando lo necesites.",
  },
];

const benefits = [
  "Haz que más jugadores encuentren tu club en Quito.",
  "Mantén la disponibilidad de cada cancha en un solo lugar.",
  "Evita cruces de reservas con una experiencia simple para todos.",
  "Cobra directamente en el club durante esta primera etapa.",
];

export const metadata = {
  title: "Conoce más | cancha",
  description: "Conoce cómo cancha ayuda a los clubes de tenis de Quito.",
};

export default function ConoceMasPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f5]">
      <header className="border-b border-stone-200/80 bg-[#f8f8f5]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link className="text-xl font-bold tracking-tight text-emerald-800" href="/">
            cancha
          </Link>
          <nav aria-label="Navegación principal" className="hidden items-center gap-7 text-sm font-medium text-stone-600 sm:flex">
            <Link className="transition hover:text-emerald-800" href="/clubs">Explorar</Link>
            <Link className="transition hover:text-emerald-800" href="/reservations">Mis reservas</Link>
          </nav>
          <Link className="rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/login">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Para clubes de tenis en Quito</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Más jugadores en tu cancha. Menos gestión manual.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              cancha reúne la disponibilidad de tu club y facilita que los jugadores encuentren, reserven y lleguen listos para jugar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="rounded-xl bg-emerald-800 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-emerald-900" href="/login">
                Quiero publicar mi club
              </Link>
              <Link className="rounded-xl border border-emerald-900/15 bg-white px-5 py-3 text-center font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/clubs">
                Ver canchas disponibles
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-emerald-900 p-6 text-white shadow-lg sm:p-8">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-emerald-700/70" />
            <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-emerald-100">Todo lo esencial para tu club</p>
              <div className="mt-5 space-y-4">
                {benefits.map((benefit) => (
                  <div className="flex gap-3" key={benefit}>
                    <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-bold text-emerald-950">✓</span>
                    <p className="text-sm leading-6 text-white">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="relative mt-6 text-sm leading-6 text-emerald-100">Sin pagos en línea por ahora: el pago se realiza directamente en tu club.</p>
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Así funciona</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Una forma sencilla de empezar.</h2>
            </div>
            <ol className="mt-9 grid gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <li className="rounded-2xl border border-stone-200 bg-[#f8f8f5] p-5" key={step.number}>
                  <span className="text-sm font-bold tracking-[0.14em] text-emerald-700">{step.number}</span>
                  <h3 className="mt-5 text-lg font-bold text-stone-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="rounded-3xl bg-stone-900 px-6 py-9 text-white sm:px-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Empecemos</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Haz que reservar en tu club sea más fácil.</h2>
            <p className="mt-4 max-w-xl leading-7 text-stone-300">Inicia sesión para comenzar a publicar tus canchas y administrar su disponibilidad.</p>
            <Link className="mt-7 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/login">
              Iniciar sesión
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
