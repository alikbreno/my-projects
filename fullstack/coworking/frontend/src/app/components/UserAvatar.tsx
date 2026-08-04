export default function Avatar({ name = "Ana Souza", size = 36 }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <button
      className="cursor-pointer group relative flex items-center justify-center rounded-full font-semibold text-zinc-950 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
      }}
      aria-label={`Perfil de ${name}`}
    >
      <span className="text-sm">{initials}</span>
      <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-cyan-400/0 transition-all duration-200 group-hover:ring-cyan-400/70 group-hover:scale-110" />
    </button>
  );
}
