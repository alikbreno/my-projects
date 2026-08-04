"use client";

import { BusySlot } from "../../types/SalaType";
import { useState } from "react";

type RoomAvailabilityClockProps = {
  busySlots: BusySlot[];
};

type DayPeriod = "morning" | "afternoon";

const RADIUS = 42;
const HALF_DAY_MINUTES = 12 * 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const periodContent: Record<
  DayPeriod,
  { label: string; range: string; start: number }
> = {
  morning: { label: "Manhã", range: "00h — 12h", start: 0 },
  afternoon: {
    label: "Tarde/noite",
    range: "12h — 24h",
    start: HALF_DAY_MINUTES,
  },
};

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getPeriodBusySlots(busySlots: BusySlot[], period: DayPeriod) {
  const periodStart = periodContent[period].start;
  const periodEnd = periodStart + HALF_DAY_MINUTES;

  return busySlots.flatMap((slot) => {
    const start = Math.max(timeToMinutes(slot.horarioInicio), periodStart);
    const end = Math.min(timeToMinutes(slot.horarioFim), periodEnd);
    return end > start
      ? [{ start: start - periodStart, duration: end - start }]
      : [];
  });
}

export default function RoomAvailabilityClock({
  busySlots,
}: RoomAvailabilityClockProps) {
  const [period, setPeriod] = useState<DayPeriod>("morning");
  const content = periodContent[period];
  const visibleSlots = getPeriodBusySlots(busySlots, period);

  function togglePeriod() {
    setPeriod((currentPeriod) =>
      currentPeriod === "morning" ? "afternoon" : "morning",
    );
  }

  return (
    <div
      className="flex items-center gap-3"
      aria-label={`Disponibilidade no período da ${content.label.toLowerCase()}`}
    >
      <button
        type="button"
        onClick={togglePeriod}
        className="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        aria-label={`Alternar para ${period === "morning" ? "tarde e noite" : "manhã"}`}
        title="Clique para alternar o período"
      >
        <svg
          viewBox="0 0 120 120"
          className="h-24 w-24 transition-transform duration-200 group-hover:scale-105"
          role="img"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#14532d"
            strokeWidth="12"
          />
          {visibleSlots.map((slot, index) => {
            const length = (slot.duration / HALF_DAY_MINUTES) * CIRCUMFERENCE;
            const offset = -((slot.start / HALF_DAY_MINUTES) * CIRCUMFERENCE);
            return (
              <circle
                key={`${slot.start}-${slot.duration}-${index}`}
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                strokeDashoffset={offset}
                transform="rotate(-90 60 60)"
              />
            );
          })}
          {Array.from({ length: 12 }, (_, index) => (
            <line
              key={index}
              x1="60"
              y1="13"
              x2="60"
              y2="19"
              stroke="#a1a1aa"
              strokeWidth="1.5"
              transform={`rotate(${index * 30} 60 60)`}
            />
          ))}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="29"
            stroke="#67e8f9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="60" cy="60" r="4" fill="#67e8f9" />
        </svg>
        <span className="absolute inset-0 rounded-full ring-1 ring-cyan-300/0 transition group-hover:ring-cyan-300/50" />
      </button>
      <div className="space-y-1 text-xs">
        <button
          type="button"
          onClick={togglePeriod}
          className="text-left outline-none focus-visible:text-cyan-300"
        >
          <p className="font-medium text-zinc-200">
            Agenda da {content.label.toLowerCase()}
          </p>
          <p className="text-zinc-500">
            {content.range} · clique para alternar
          </p>
        </button>
        <p className="flex items-center gap-1.5 text-zinc-400">
          <i className="h-2 w-2 rounded-full bg-green-700" />
          Livre
        </p>
        <p className="flex items-center gap-1.5 text-zinc-400">
          <i className="h-2 w-2 rounded-full bg-red-500" />
          Ocupado
        </p>
      </div>
    </div>
  );
}
