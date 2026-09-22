import Link from "next/link";

type Court = {
  name: string;
  surface: string;
  price: number;
};

const courts: Record<string, Court> = {
  "court-1": { name: "Cancha 1", surface: "Arcilla", price: 12 },
  "court-2": { name: "Cancha 2", surface: "Cemento", price: 12 },
  "court-3": { name: "Cancha 3", surface: "Arcilla", price: 14 },
};

const dateFormatter = new Intl.DateTimeFormat("es-EC", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isValidDate(value: string | undefined) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime()));
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T12:00:00`)).replace(/^./, (letter) => letter.toUpperCase());
}

export default async function ConfirmReservationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const courtId = firstValue(params.court);
  const date = firstValue(params.date);
  const time = firstValue(params.time);
  const duration = Number(firstValue(params.duration));
  const court = courtId ? courts[courtId] : undefined;
  const validTime = Boolean(time && /^([01]\d|2[0-3]):00$/.test(time));
  const validDuration = [1, 2, 3].includes(duration);

  if (!courtId || !court || !date || !time || !isValidDate(date) || !validTime || !validDuration) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f8f5] px-5 text-center">
        <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Reserva</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">Elige un horario para continuar</h1>
          <p className="mt-3 text-stone-600">Necesitamos los datos de tu reserva para mostrarte el resumen.</p>
          <Link className="mt-6 inline-flex rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900" href="/availability">Ver disponibilidad</Link>
        </div>
      </main>
    );
  }

  const endHour = Number(time.slice(0, 2)) + duration;
  const availabilityHref = `/availability?court=${encodeURIComponent(courtId)}&date=${date}&time=${time}&duration=${duration}`;

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-5 py-7 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950" href={availabilityHref}>
          <span aria-hidden="true">←</span> Editar reserva
        </Link>
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="confirmation-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Último paso</p>
          <h1 id="confirmation-heading" className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Revisa tu reserva</h1>
          <p className="mt-3 leading-7 text-stone-600">Confirma que los detalles estén correctos. El pago se realiza directamente en el club.</p>

          <dl className="mt-7 divide-y divide-stone-100 border-y border-stone-100">
            <div className="py-4"><dt className="text-sm text-stone-500">Club</dt><dd className="mt-1 font-semibold text-stone-900">Club Terravalle</dd><p className="mt-1 text-sm text-stone-600">Av. Interoceánica, Cumbayá</p></div>
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-stone-500">Cancha</dt><dd className="text-right font-semibold text-stone-900">{court.name}<span className="block text-sm font-normal text-stone-600">{court.surface}</span></dd></div>
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-stone-500">Fecha</dt><dd className="text-right font-semibold capitalize text-stone-900">{formatDate(date)}</dd></div>
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-stone-500">Horario</dt><dd className="font-semibold text-stone-900">{time} – {String(endHour).padStart(2, "0")}:00</dd></div>
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-stone-500">Total</dt><dd className="text-xl font-bold text-stone-900">${(court.price * duration).toFixed(2)}</dd></div>
          </dl>

          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">Al confirmar, tu horario quedará reservado. Te recomendamos llegar unos minutos antes.</p>
          <button className="mt-5 w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900" type="button">Confirmar reserva</button>
        </section>
      </div>
    </main>
  );
}
