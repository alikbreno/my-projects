const features = [
  {
    icon: "◆",
    title: "Reserva instantânea",
    desc: "Veja mesas e salas livres agora mesmo e confirme em segundos, direto pelo app.",
  },
  {
    icon: "▣",
    title: "Salas privadas",
    desc: "Reuniões, calls e trabalho focado por hora ou dia inteiro, com equipamento incluso.",
  },
  {
    icon: "◈",
    title: "Rede de unidades",
    desc: "Um único login te dá acesso a espaços parceiros em outras cidades quando você viajar.",
  },
  {
    icon: "◉",
    title: "Comunidade ativa",
    desc: "Eventos, encontros e networking real com quem também trabalha por lá.",
  },
];

export default function Features() {
  return (
    <section id="produto" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <div className="inline-flex font-mono text-xs text-cyan-400 border border-cyan-400/25 bg-cyan-400/10 rounded-full px-3 py-1.5 mb-4">
            O QUE É
          </div>
          <h2 className="text-3xl font-bold text-zinc-50 mb-3">
            Uma plataforma, todos os espaços de que você precisa.
          </h2>
          <p className="text-zinc-400">
            Sem contrato fixo, sem burocracia de recepção. Você escolhe onde
            e quando trabalhar, e o app cuida do resto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 hover:-translate-y-1 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-zinc-50 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}