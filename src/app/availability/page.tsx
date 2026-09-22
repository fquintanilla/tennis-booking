"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Court = {
  id: string;
  name: string;
  surface: string;
  price: number;
  detail: string;
};

type SlotState = "available" | "reserved" | "blocked";

const courts: Court[] = [
  { id: "court-1", name: "Cancha 1", surface: "Arcilla", price: 12, detail: "Exterior" },
  { id: "court-2", name: "Cancha 2", surface: "Cemento", price: 12, detail: "Exterior" },
  { id: "court-3", name: "Cancha 3", surface: "Arcilla", price: 14, detail: "Iluminación nocturna" },
];

const times = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const slotStatus: Record<string, SlotState> = {
  "08:00": "reserved",
  "12:00": "blocked",
  "17:00": "reserved",
  "18:00": "reserved",
};

const durations = [1, 2, 3];

const initialDate = new Date(2026, 8, 22);
const weekdayFormatter = new Intl.DateTimeFormat("es-EC", { weekday: "short" });
const monthFormatter = new Intl.DateTimeFormat("es-EC", { month: "short" });
const longDateFormatter = new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long" });
const monthYearFormatter = new Intl.DateTimeFormat("es-EC", { month: "long", year: "numeric" });

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function sameDay(firstDate: Date, secondDate: Date) {
  return firstDate.getFullYear() === secondDate.getFullYear()
    && firstDate.getMonth() === secondDate.getMonth()
    && firstDate.getDate() === secondDate.getDate();
}

function formatDate(date: Date) {
  const formatted = longDateFormatter.format(date).replace(/^./, (letter) => letter.toUpperCase());
  return sameDay(date, initialDate) ? `Hoy, ${formatted}` : formatted;
}

function shortWeekday(date: Date) {
  return weekdayFormatter.format(date).replace(".", "").replace(/^./, (letter) => letter.toUpperCase());
}

function monthName(date: Date) {
  return monthFormatter.format(date).replace(".", "");
}

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedCourt, setSelectedCourt] = useState(courts[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const court = useMemo(() => courts.find((item) => item.id === selectedCourt) ?? courts[0], [selectedCourt]);
  const selectedSlotIndex = selectedTime ? times.indexOf(selectedTime) : -1;
  const selectedEndHour = selectedSlotIndex >= 0 ? Number(times[selectedSlotIndex].slice(0, 2)) + duration : null;
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(initialDate, index)), []);
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const start = addDays(firstDay, -offset);
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [calendarMonth]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsCalendarOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function isRangeAvailable(startIndex: number, selectedDuration: number) {
    return Array.from({ length: selectedDuration }, (_, offset) => times[startIndex + offset]).every(
      (time) => time && !slotStatus[time],
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f5]">
      <header className="border-b border-stone-200/80 bg-[#f8f8f5]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link className="text-xl font-bold tracking-tight text-emerald-800" href="/">cancha</Link>
          <nav aria-label="Navegación principal" className="hidden items-center gap-7 text-sm font-medium text-stone-600 sm:flex">
            <Link className="text-emerald-800" href="/clubs">Explorar</Link>
            <Link className="transition hover:text-emerald-800" href="/reservations">Mis reservas</Link>
          </nav>
          <Link className="rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/login">Iniciar sesión</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950" href="/clubs">
          <span aria-hidden="true">←</span> Volver a clubes
        </Link>

        <div className="mt-6 flex flex-col gap-7 lg:flex-row lg:items-start">
          <section className="min-w-0 flex-1" aria-labelledby="availability-heading">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Club Terravalle · Cumbayá</p>
            <h1 id="availability-heading" className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Elige tu horario para jugar.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">Selecciona una fecha, cancha y horario disponible. La reserva se confirma en el siguiente paso.</p>

            <section className="mt-7" aria-labelledby="date-heading">
              <div className="flex items-center justify-between"><h2 id="date-heading" className="text-lg font-bold text-stone-900">¿Cuándo quieres jugar?</h2><button aria-expanded={isCalendarOpen} aria-haspopup="dialog" className="text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4" onClick={() => setIsCalendarOpen(true)} type="button">Ver calendario</button></div>
              <div className="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0" role="list" aria-label="Fechas disponibles">
                {dates.map((date) => {
                  const active = sameDay(selectedDate, date);
                  return <button aria-pressed={active} className={`min-w-17 shrink-0 rounded-xl border px-3 py-2.5 text-center transition ${active ? "border-emerald-800 bg-emerald-800 text-white shadow-sm" : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"}`} key={date.toISOString()} onClick={() => { setSelectedDate(date); setSelectedTime(null); }} type="button"><span className="block text-xs font-medium">{sameDay(date, initialDate) ? "Hoy" : shortWeekday(date)}</span><span className="mt-0.5 block text-xl font-bold leading-6">{date.getDate()}</span><span className={`block text-[11px] ${active ? "text-emerald-100" : "text-stone-500"}`}>{monthName(date)}</span></button>;
                })}
              </div>
              {isCalendarOpen && <div aria-labelledby="calendar-title" aria-modal="true" className="fixed inset-0 z-50 flex items-end bg-stone-950/35 p-4 sm:items-center sm:justify-center" onMouseDown={() => setIsCalendarOpen(false)} role="dialog">
                <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
                  <div className="flex items-center justify-between gap-3"><button aria-label="Mes anterior" className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} type="button">←</button><h3 id="calendar-title" className="font-bold capitalize text-stone-900">{monthYearFormatter.format(calendarMonth)}</h3><button aria-label="Mes siguiente" className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} type="button">→</button></div>
                  <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
                  <div className="mt-2 grid grid-cols-7 gap-1" aria-label="Días del calendario">{calendarDays.map((date) => {
                    const inMonth = date.getMonth() === calendarMonth.getMonth();
                    const unavailable = date < initialDate;
                    const active = sameDay(date, selectedDate);
                    return <button aria-label={formatDate(date)} aria-pressed={active} className={`aspect-square rounded-lg text-sm font-semibold transition ${active ? "bg-emerald-800 text-white" : !inMonth ? "text-stone-300" : unavailable ? "cursor-not-allowed text-stone-300" : "text-stone-800 hover:bg-emerald-50 hover:text-emerald-800"}`} disabled={unavailable} key={date.toISOString()} onClick={() => { setSelectedDate(date); setSelectedTime(null); setIsCalendarOpen(false); }} type="button">{date.getDate()}</button>;
                  })}</div>
                  <button className="mt-5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50" onClick={() => setIsCalendarOpen(false)} type="button">Cerrar calendario</button>
                </div>
              </div>}
            </section>

            <section className="mt-8" aria-labelledby="court-heading">
              <h2 id="court-heading" className="text-lg font-bold text-stone-900">Escoge una cancha</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {courts.map((item) => {
                  const active = item.id === selectedCourt;
                  return <button aria-pressed={active} className={`rounded-2xl border p-4 text-left transition ${active ? "border-emerald-800 bg-emerald-50 ring-1 ring-emerald-800" : "border-stone-200 bg-white hover:border-emerald-400"}`} key={item.id} onClick={() => { setSelectedCourt(item.id); setSelectedTime(null); }} type="button"><div className="flex items-start justify-between gap-2"><span className="font-bold text-stone-900">{item.name}</span>{active && <span aria-label="Cancha seleccionada" className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-xs text-white">✓</span>}</div><span className="mt-2 block text-sm text-stone-600">{item.surface} · {item.detail}</span><span className="mt-3 block text-sm font-semibold text-stone-900">${item.price}<span className="font-normal text-stone-500"> / hora</span></span></button>;
                })}
              </div>
            </section>

            <section className="mt-8" aria-labelledby="time-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-2"><div><h2 id="time-heading" className="text-lg font-bold text-stone-900">Horarios disponibles</h2><p className="mt-1 text-sm text-stone-500">{formatDate(selectedDate)} · {court.name}</p></div></div>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-3"><span className="text-sm font-medium text-stone-700">¿Cuánto tiempo quieres jugar?</span><div className="flex rounded-lg border border-stone-200 bg-white p-0.5" aria-label="Duración de la reserva">{durations.map((value) => <button aria-pressed={duration === value} className={`rounded-md px-2.5 py-1.5 text-sm font-semibold transition ${duration === value ? "bg-emerald-800 text-white" : "text-stone-600 hover:bg-emerald-50 hover:text-emerald-800"}`} key={value} onClick={() => { setDuration(value); setSelectedTime(null); }} type="button">{value} h</button>)}</div></div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-label="Horarios">
                {times.map((time, index) => {
                  const status = slotStatus[time] ?? "available";
                  const rangeAvailable = isRangeAvailable(index, duration);
                  const actuallyUnavailable = status !== "available";
                  const canStartBooking = !actuallyUnavailable && rangeAvailable;
                  const selected = selectedSlotIndex >= 0 && index >= selectedSlotIndex && index < selectedSlotIndex + duration;
                  const label = actuallyUnavailable
                    ? status === "reserved" ? "reservado" : "bloqueado"
                    : !canStartBooking ? `no permite ${duration} horas seguidas`
                    : "disponible";
                  return <button aria-label={`${time}, ${label}`} aria-pressed={selected} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${selected ? "border-emerald-800 bg-emerald-800 text-white" : actuallyUnavailable ? "cursor-not-allowed border-stone-100 bg-stone-100 text-stone-400 line-through" : !canStartBooking ? "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-800" : "border-stone-200 bg-white text-stone-800 hover:border-emerald-600 hover:bg-emerald-50"}`} disabled={!canStartBooking} key={time} onClick={() => setSelectedTime(time)} title={label} type="button">{time}</button>;
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-500"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full border border-emerald-700 bg-white" />Disponible</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-stone-300" />Reservado o bloqueado</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber-300" />No permite {duration} h seguidas</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-800" />Seleccionado</span></div>
            </section>
          </section>

          <aside className="sticky top-5 w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:w-80" aria-labelledby="summary-heading">
            <div className="flex items-center justify-between"><h2 id="summary-heading" className="text-lg font-bold text-stone-900">Tu reserva</h2><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">{duration} {duration === 1 ? "hora" : "horas"}</span></div>
            <div className="mt-5 border-y border-stone-100 py-4"><p className="font-semibold text-stone-900">Club Terravalle</p><p className="mt-1 text-sm text-stone-600">Av. Interoceánica, Cumbayá</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-stone-500">Cancha</dt><dd className="font-medium text-stone-900">{court.name}</dd></div><div className="flex justify-between gap-4"><dt className="text-stone-500">Fecha</dt><dd className="text-right font-medium text-stone-900">{formatDate(selectedDate)}</dd></div><div className="flex justify-between gap-4"><dt className="text-stone-500">Horario</dt><dd className={`font-medium ${selectedTime ? "text-stone-900" : "text-stone-400"}`}>{selectedTime && selectedEndHour ? `${selectedTime} – ${String(selectedEndHour).padStart(2, "0")}:00` : "Elige un horario"}</dd></div></dl></div>
            <div className="mt-4 flex items-end justify-between"><span className="text-sm text-stone-500">Total</span><span className="text-xl font-bold text-stone-900">${(court.price * duration).toFixed(2)}</span></div>
            <button className="mt-5 w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400" disabled={!selectedTime} type="button">Continuar con la reserva</button>
            <p className="mt-3 text-center text-xs leading-5 text-stone-500">Pago directamente en el club. Podrás revisar tu reserva antes de confirmarla.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
