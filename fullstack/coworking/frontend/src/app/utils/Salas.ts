export function toDisplayDate(date: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function toApiDate(date: string) {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
}

export const textFieldSlotProps = {
  inputLabel: {
    sx: { color: "#a1a1aa", "&.Mui-focused": { color: "#22d3ee" } },
  },
  input: {
    sx: {
      color: "#f4f4f5",
      backgroundColor: "#18181b",
      borderRadius: 1,
      "& fieldset": { borderColor: "#3f3f46" },
      "&:hover fieldset": { borderColor: "#52525b" },
      "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
    },
  },
  formHelperText: { sx: { height: "20px", marginLeft: 0, marginTop: "4px" } },
};
