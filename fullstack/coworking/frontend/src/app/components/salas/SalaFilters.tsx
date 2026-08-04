"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, TextField } from "@mui/material";
import {
  CalendarDays,
  Clock3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  SalaFiltersForm,
  SalaFiltersSchema,
} from "../../schemas/SalaFiltersSchema";
import { maskDate, maskTime } from "../../utils/MaskUtils";
import {
  textFieldSlotProps,
  toApiDate,
  toDisplayDate,
} from "../../utils/Salas";

export default function SalaFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const urlDate = searchParams.get("date") ?? "";
  const urlTime = searchParams.get("time") ?? "";
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SalaFiltersForm>({
    resolver: zodResolver(SalaFiltersSchema),
    mode: "onBlur",
    defaultValues: { search, data: toDisplayDate(urlDate), horario: urlTime },
  });
  const selectedDate = useWatch({ control, name: "data" });

  useEffect(() => {
    reset({ search, data: toDisplayDate(urlDate), horario: urlTime });
  }, [reset, search, urlDate, urlTime]);

  const hasFilters = Boolean(search || urlDate || urlTime);

  function applyAvailabilityFilters({
    search: searchValue,
    data,
    horario,
  }: SalaFiltersForm) {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedSearch = searchValue.trim();
    if (normalizedSearch) params.set("search", normalizedSearch);
    else params.delete("search");
    if (data) params.set("date", toApiDate(data));
    else params.delete("date");
    if (data && horario) params.set("time", horario);
    else params.delete("time");
    router.replace(
      params.size ? `${pathname}?${params.toString()}` : pathname,
      {
        scroll: false,
      },
    );
  }

  function clearFilters() {
    reset({ search: "", data: "", horario: "" });
    router.replace(pathname, { scroll: false });
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/10 sm:p-5">
      <form
        onSubmit={handleSubmit(applyAvailabilityFilters)}
        noValidate
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_205px_190px_auto] lg:items-end"
      >
        <TextField
          label="Buscar sala"
          {...register("search")}
          placeholder="Ex.: reunião, foco..."
          helperText=" "
          className="w-full"
          slotProps={{
            ...textFieldSlotProps,
            input: {
              ...textFieldSlotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="h-4 w-4 text-zinc-500" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Data"
          placeholder="DD/MM/AAAA"
          {...register("data", {
            onChange: (event) =>
              (event.target.value = maskDate(event.target.value)),
          })}
          error={Boolean(errors.data)}
          helperText={errors.data?.message ?? " "}
          className="w-full"
          slotProps={{
            ...textFieldSlotProps,
            input: {
              ...textFieldSlotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarDays className="h-4 w-4 text-zinc-500" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Horário"
          placeholder="HH:MM"
          disabled={!selectedDate}
          {...register("horario", {
            onChange: (event) =>
              (event.target.value = maskTime(event.target.value)),
          })}
          error={Boolean(errors.horario)}
          helperText={errors.horario?.message ?? " "}
          className="w-full"
          slotProps={{
            ...textFieldSlotProps,
            input: {
              ...textFieldSlotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Clock3 className="h-4 w-4 text-zinc-500" />
                </InputAdornment>
              ),
            },
          }}
        />
        <div className="flex gap-2 pb-6">
          <button
            type="submit"
            className="cursor-pointer inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Aplicar
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-3 text-sm font-medium text-zinc-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
              aria-label="Limpar filtros"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </form>
      {!selectedDate && (
        <p className="mt-3 text-xs text-zinc-500">
          Use a mesma data e horário da reserva para consultar a
          disponibilidade.
        </p>
      )}
    </section>
  );
}
