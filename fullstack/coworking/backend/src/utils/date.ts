const MIN_ANTECEDENCIA_MINUTOS = 60

// Recebe "YYYY-MM-DD" e monta a data em UTC, sem componente de hora.
// Sempre usar essa função pra converter datas vindas do client, garante
// que duas datas "iguais" gerem o mesmo Date internamente.
export function toDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function todayDateOnly(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export function isPastDate(date: Date): boolean {
  return date.getTime() < todayDateOnly().getTime()
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setUTCHours(hours, minutes, 0, 0)
  return combined
}

export function hasMinimumAdvance(
  target: Date,
  minMinutes = MIN_ANTECEDENCIA_MINUTOS
): boolean {
  const diffMs = target.getTime() - Date.now()
  return diffMs >= minMinutes * 60 * 1000
}

// "HH:mm" com zero à esquerda compara certo como string comum
export function isValidTimeRange(inicio: string, fim: string): boolean {
  return inicio < fim
}
