const footerColumns = [
  {
    title: "Produto",
    links: [
      { label: "Espaços", href: "#produto" },
      { label: "Salas reservadas", href: "#" },
      { label: "Preços", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Unidades parceiras", href: "#" },
      { label: "Carreiras", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Contato", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <a
              href="#top"
              className="flex items-center gap-2 font-display font-bold text-lg text-zinc-50"
            >
              <span>
                COWORKING<span className="text-cyan-400">app</span>
              </span>
            </a>
            <p className="text-sm text-zinc-500 mt-3.5 max-w-xs">
              A forma mais simples de encontrar e reservar espaços de
              trabalho compartilhado, em tempo real.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-zinc-300 mb-4">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-zinc-500 hover:text-zinc-200 transition-colors mb-2.5"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2.5 pt-6 border-t border-zinc-800 text-xs text-zinc-600">
          <span>© 2026 COWORKINGapp. Todos os direitos reservados.</span>
          <span>Feito para quem trabalha onde quiser.</span>
        </div>
      </div>
    </footer>
  );
}