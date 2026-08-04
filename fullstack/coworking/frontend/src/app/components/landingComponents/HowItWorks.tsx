const steps = [
  {
    step: "01",
    title: "Escolha o espaço",
    desc: "Filtre por cidade, tipo de mesa ou sala e veja fotos e disponibilidade real.",
    padding: "pt-0 md:pr-8 pb-8 md:pb-0",
    border: "border-b md:border-b-0 md:border-r",
  },
  {
    step: "02",
    title: "Reserve na hora",
    desc: "Confirmação instantânea, sem precisar ligar ou esperar retorno por e-mail.",
    padding: "pt-8 md:pt-0 md:px-8 pb-8 md:pb-0",
    border: "border-b md:border-b-0 md:border-r",
  },
  {
    step: "03",
    title: "Chegue e trabalhe",
    desc: "Check-in por QR code na entrada e sua mesa já está pronta pra você.",
    padding: "pt-8 md:pt-0 md:pl-8",
    border: "",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="border-y border-zinc-800 bg-zinc-900">
      <div className="max-w-6xl mx-auto px-6 pt-20">
        <div className="max-w-xl mb-2">
          <div className="inline-flex font-mono text-xs text-cyan-400 border border-cyan-400/25 bg-cyan-400/10 rounded-full px-3 py-1.5 mb-4">
            COMO FUNCIONA
          </div>
          <h2 className="text-3xl font-bold text-zinc-50 mb-14">
            Do login à mesa reservada em menos de um minuto.
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 pb-20">
        {steps.map((item) => (
          <div
            key={item.step}
            className={`${item.padding} ${item.border} border-zinc-800`}
          >
            <span className="font-mono text-cyan-400 text-sm block mb-3">
              {item.step}
            </span>
            <h3 className="font-semibold text-zinc-50 text-lg mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}