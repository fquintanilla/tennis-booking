export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <span className="text-xl font-bold tracking-tight text-emerald-800">cancha</span>
        <a className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" href="/login">Iniciar sesión</a>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-14 sm:px-8 sm:py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Tenis en Quito</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">Tu próxima cancha está lista para reservar.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">Encuentra clubes, consulta horarios disponibles y reserva en pocos pasos.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a className="rounded-xl bg-emerald-800 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-emerald-900" href="/clubs">Explorar canchas</a>
          <a className="rounded-xl border border-emerald-900/15 bg-white px-5 py-3 text-center font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/reservations">Mis reservas</a>
        </div>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-5 py-6 text-sm text-stone-500 sm:px-8">Pago directamente en el club.</footer>
    </div>
  );
}
