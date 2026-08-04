export function isValidCpfFormat(cpf: string) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

export function isValidPasswordFormat(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function isValidPhoneFormat(phone: string | undefined) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(phone || "");
}

export function isValidTimeFormat(time: string) {
  return /^\d{2}:\d{2}$/.test(time);
}

export function isValidTimeRange(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

export function isValidDateFormat(date: string) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

export function isValidTimeOrder(inicio: string, fim: string) {
  const [hIni, mIni] = inicio.split(":").map(Number);
  const [hFim, mFim] = fim.split(":").map(Number);

  const inicioEmMinutos = hIni * 60 + mIni;
  const fimEmMinutos = hFim * 60 + mFim;

  return fimEmMinutos > inicioEmMinutos;
}

export function isNotPastDate(date: string) {
  const [day, month, year] = date.split("/").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  
  return inputDate >= today;
}

export function isValidDateRange(date: string) {
  const [day, month, year] = date.split("/").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}
