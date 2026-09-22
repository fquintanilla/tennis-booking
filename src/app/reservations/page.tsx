"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReservationStatus = "confirmed" | "cancelled";
type ReservationSection = "upcoming" | "past" | "cancelled";

type Reservation = {
  id: string;
  club: string;
  address: string;
  court: string;
  surface: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: ReservationStatus;
};

const initialReservations: Reservation[] = [
  { id: "reservation-1", club: "Club Terravalle", address: "Av. Interoceánica, Cumbayá", court: "Cancha 3", surface: "Arcilla · Iluminación nocturna", date: "2026-09-24", startTime: "18:00", endTime: "20:00", price: 28, status: "confirmed" },
  { id: "reservation-2", club: "Quito Tenis & Golf Club", address: "Av. Mariscal Sucre, El Condado", court: "Cancha 2", surface: "Cemento · Exterior", date: "2026-09-28", startTime: "08:00", endTime: "09:00", price: 14, status: "confirmed" },
  { id: "reservation-3", club: "Club Rancho San Francisco", address: "Av. Interoceánica, Cumbayá", court: "Cancha 1", surface: "Césped sintético · Exterior", date: "2026-09-18", startTime: "17:00", endTime: "18:00", price: 10, status: "confirmed" },
  { id: "reservation-4", club: "Club Terravalle", address: "Av. Interoceánica, Cumbayá", court: "Cancha 1", surface: "Arcilla · Exterior", date: "2026-09-16", startTime: "10:00", endTime: "11:00", price: 12, status: "cancelled" },
];

const today = "2026-09-22";
const dateFormatter = new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const sections: { id: ReservationSection; label: string }[] = [
  { id: "upcoming", label: "Próximas" },
  { id: "past", label: "Anteriores" },
  { id: "cancelled", label: "Canceladas" },
];

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`)).replace(/^./, (letter) => letter.toUpperCase());
}

function isInSection(reservation: Reservation, section: ReservationSection) {
  if (section === "cancelled") return reservation.status === "cancelled";
  if (reservation.status === "cancelled") return false;
  return section === "upcoming" ? reservation.date >= today : reservation.date < today;
}

function statusLabel(reservation: Reservation) {
  return reservation.status === "cancelled" ? "Cancelada" : reservation.date >= today ? "Confirmada" : "Finalizada";
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations);
  const [section, setSection] = useState<ReservationSection>("upcoming");
  const [cancelledReservation, setCancelledReservation] = useState<string | null>(null);
  const visibleReservations = useMemo(
    () => reservations.filter((reservation) => isInSection(reservation, section)),
    [reservations, section],
  );

  function cancelReservation(id: string) {
    setReservations((current) => current.map((reservation) => reservation.id === id ? { ...reservation, status: "cancelled" } : reservation));
    setCancelledReservation(id);
  }

  return (
    <div className="min-h-screen bg-[#f8f8f5]">
      <header className="border-b border-stone-200/80 bg-[#f8f8f5]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link className="text-xl font-bold tracking-tight text-emerald-800" href="/">cancha</Link>
          <nav aria-label="Navegación principal" className="hidden items-center gap-7 text-sm font-medium text-stone-600 sm:flex">
            <Link className="transition hover:text-emerald-800" href="/clubs">Explorar</Link>
            <Link aria-current="page" className="text-emerald-800" href="/reservations">Mis reservas</Link>
          </nav>
          <Link className="rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/login">Iniciar sesión</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Tus partidos</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Mis reservas</h1>
            <p className="mt-3 max-w-xl leading-7 text-stone-600">Revisa tus próximas canchas, tu historial de juego y las reservas canceladas.</p>
          </div>
          <Link className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900" href="/clubs">Reservar una cancha</Link>
        </div>

        {cancelledReservation && (
          <div className="mt-7 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950" role="status">
            <p><span className="font-semibold">Reserva cancelada.</span> El horario vuelve a estar disponible según la política del club.</p>
            <button aria-label="Cerrar aviso" className="shrink-0 font-semibold text-emerald-800 hover:text-emerald-950" onClick={() => setCancelledReservation(null)} type="button">×</button>
          </div>
        )}

        <div className="mt-8 border-b border-stone-200" role="tablist" aria-label="Estado de reservas">
          <div className="flex gap-5 overflow-x-auto">
            {sections.map((item) => {
              const count = reservations.filter((reservation) => isInSection(reservation, item.id)).length;
              const selected = item.id === section;
              return <button aria-controls="reservation-list" aria-selected={selected} className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold transition ${selected ? "border-emerald-800 text-emerald-800" : "border-transparent text-stone-500 hover:text-stone-900"}`} key={item.id} onClick={() => setSection(item.id)} role="tab" type="button">{item.label} <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${selected ? "bg-emerald-100" : "bg-stone-100 text-stone-600"}`}>{count}</span></button>;
            })}
          </div>
        </div>

        <section aria-live="polite" className="mt-6 space-y-4" id="reservation-list" role="tabpanel">
          {visibleReservations.length ? visibleReservations.map((reservation) => {
            const canCancel = section === "upcoming" && reservation.status === "confirmed";
            return (
              <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm" key={reservation.id}>
                <div className="border-b border-stone-100 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                  <div><h2 className="font-bold text-stone-900">{reservation.club}</h2><p className="mt-1 text-sm text-stone-500">{reservation.address}</p></div>
                  <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold sm:mt-0 ${reservation.status === "cancelled" ? "bg-stone-100 text-stone-600" : "bg-emerald-100 text-emerald-800"}`}>{statusLabel(reservation)}</span>
                </div>
                <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1.3fr_1fr_1fr]">
                  <div><p className="text-sm text-stone-500">Cancha</p><p className="mt-1 font-semibold text-stone-900">{reservation.court}</p><p className="mt-1 text-sm text-stone-600">{reservation.surface}</p></div>
                  <div><p className="text-sm text-stone-500">Fecha y hora</p><p className="mt-1 font-semibold capitalize text-stone-900">{formatDate(reservation.date)}</p><p className="mt-1 text-sm text-stone-600">{reservation.startTime} – {reservation.endTime}</p></div>
                  <div className="flex items-end justify-between gap-4 sm:block"><div><p className="text-sm text-stone-500">Total</p><p className="mt-1 text-lg font-bold text-stone-900">${reservation.price.toFixed(2)}</p><p className="mt-1 text-sm text-stone-600">Pago en el club</p></div>{canCancel && <button className="rounded-lg px-2 py-1 text-sm font-semibold text-stone-600 underline decoration-stone-300 underline-offset-4 transition hover:text-red-700" onClick={() => cancelReservation(reservation.id)} type="button">Cancelar</button>}</div>
                </div>
              </article>
            );
          }) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
              <p className="text-lg font-bold text-stone-900">No tienes reservas {section === "upcoming" ? "próximas" : section === "past" ? "anteriores" : "canceladas"}.</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{section === "upcoming" ? "Encuentra una cancha disponible y agenda tu próximo partido." : "Aquí aparecerán las reservas de este estado."}</p>
              {section === "upcoming" && <Link className="mt-5 inline-flex rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900" href="/clubs">Explorar clubes</Link>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
