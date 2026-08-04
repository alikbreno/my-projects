const stats = [
  {
    label: "espaços parceiros no Brasil",
    render: () => <span className="text-cyan-400">38</span>,
  },
  {
    label: "reservas feitas por mês",
    render: () => "4.200",
  },
  {
    label: "dos membros recomendam",
    render: () => (
      <>
        97<span className="text-cyan-400">%</span>
      </>
    ),
  },
];

export default function Stats() {
  return (
    <section id="numeros" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-3 gap-9 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="font-mono text-4xl font-medium text-zinc-50">
              {stat.render()}
            </div>
            <div className="text-sm text-zinc-500 mt-1.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}