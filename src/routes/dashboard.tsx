import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  FileSignature,
  LayoutDashboard,
  FilePlus2,
  Settings,
  LogOut,
  Download,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel — ContratoRápido" },
      { name: "description", content: "Gere contratos profissionais em tempo real." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type ContractType =
  | ""
  | "servicos_gerais"
  | "social_media"
  | "visita_imobiliaria"
  | "mentoria";

const CONTRACT_LABELS: Record<Exclude<ContractType, "">, string> = {
  servicos_gerais: "Prestação de Serviços Gerais",
  social_media: "Social Media / Marketing",
  visita_imobiliaria: "Termo de Visita Imobiliária",
  mentoria: "Contrato de Mentoria / Consultoria",
};

interface FormState {
  tipo: ContractType;
  contratanteNome: string;
  contratanteDoc: string;
  contratadoNome: string;
  contratadoDoc: string;
  descricao: string;
  valor: string;
  pagamento: string;
  prazo: string;
  foro: string;
}

const initialForm: FormState = {
  tipo: "",
  contratanteNome: "",
  contratanteDoc: "",
  contratadoNome: "",
  contratadoDoc: "",
  descricao: "",
  valor: "",
  pagamento: "",
  prazo: "",
  foro: "",
};

function ph(v: string, fallback: string) {
  return v.trim() ? v : `[${fallback}]`;
}

function buildContract(form: FormState): { title: string; paragraphs: string[] } | null {
  if (!form.tipo) return null;
  const title = `CONTRATO DE ${CONTRACT_LABELS[form.tipo].toUpperCase()}`;

  const contratante = `${ph(form.contratanteNome, "NOME DO CONTRATANTE")}, inscrito(a) no CPF/CNPJ sob nº ${ph(form.contratanteDoc, "CPF/CNPJ DO CONTRATANTE")}, doravante denominado(a) CONTRATANTE`;
  const contratado = `${ph(form.contratadoNome, "NOME DO CONTRATADO")}, inscrito(a) no CPF/CNPJ sob nº ${ph(form.contratadoDoc, "CPF/CNPJ DO CONTRATADO")}, doravante denominado(a) CONTRATADO`;

  const paragraphs = [
    `Pelo presente instrumento particular, de um lado ${contratante}, e de outro lado ${contratado}, têm entre si justo e contratado o presente Contrato de ${CONTRACT_LABELS[form.tipo]}, que se regerá pelas cláusulas e condições a seguir:`,
    `CLÁUSULA PRIMEIRA — DO OBJETO`,
    `O presente contrato tem por objeto a prestação, pelo CONTRATADO ao CONTRATANTE, dos seguintes serviços: ${ph(form.descricao, "DESCRIÇÃO DETALHADA DO SERVIÇO")}.`,
    `CLÁUSULA SEGUNDA — DO VALOR E FORMA DE PAGAMENTO`,
    `Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${ph(form.valor, "VALOR")}, a ser pago na seguinte forma: ${ph(form.pagamento, "FORMA DE PAGAMENTO")}.`,
    `CLÁUSULA TERCEIRA — DO PRAZO`,
    `O presente contrato terá vigência / prazo de entrega de ${ph(form.prazo, "PRAZO DE ENTREGA OU VIGÊNCIA")}, contados a partir da assinatura deste instrumento.`,
    `CLÁUSULA QUARTA — DAS OBRIGAÇÕES`,
    `O CONTRATADO obriga-se a executar os serviços com zelo, técnica e dentro dos prazos estipulados. O CONTRATANTE obriga-se a efetuar os pagamentos nas condições acordadas e fornecer as informações necessárias à execução do objeto.`,
    `CLÁUSULA QUINTA — DA RESCISÃO`,
    `O presente contrato poderá ser rescindido por qualquer das partes, mediante notificação prévia de 15 (quinze) dias, sem prejuízo da quitação dos serviços já prestados até a data da rescisão.`,
    `CLÁUSULA SEXTA — DO FORO`,
    `Fica eleito o foro da comarca de ${ph(form.foro, "CIDADE")} para dirimir quaisquer dúvidas oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`,
    `E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor e forma.`,
    `${ph(form.foro, "CIDADE")}, ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}.`,
    `_______________________________________\n${ph(form.contratanteNome, "CONTRATANTE")}\nCONTRATANTE`,
    `_______________________________________\n${ph(form.contratadoNome, "CONTRATADO")}\nCONTRATADO`,
  ];

  return { title, paragraphs };
}

function Dashboard() {
  const [form, setForm] = useState<FormState>(initialForm);
  const contract = useMemo(() => buildContract(form), [form]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const downloadPdf = () => {
    if (!contract) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 60;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(contract.title, maxWidth);
    doc.text(titleLines, pageWidth / 2, y, { align: "center" });
    y += titleLines.length * 18 + 12;

    doc.setFont("times", "normal");
    doc.setFontSize(11);

    for (const p of contract.paragraphs) {
      const isHeading = /^CLÁUSULA/.test(p);
      doc.setFont("times", isHeading ? "bold" : "normal");
      const lines = doc.splitTextToSize(p, maxWidth);
      const blockH = lines.length * 15 + 10;
      if (y + blockH > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y, { align: isHeading ? "left" : "justify", maxWidth });
      y += blockH;
    }

    doc.save("contrato.pdf");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-md bg-brand grid place-items-center">
            <FileSignature className="h-4 w-4 text-brand-foreground" />
          </div>
          <span className="font-semibold">ContratoRápido</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <SidebarItem icon={<LayoutDashboard className="h-4 w-4" />} label="Painel" active />
          <SidebarItem icon={<FilePlus2 className="h-4 w-4" />} label="Novo Contrato" />
          <SidebarItem icon={<FileText className="h-4 w-4" />} label="Meus Contratos" />
          <SidebarItem icon={<Settings className="h-4 w-4" />} label="Configurações" />
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-accent transition">
            <div className="h-9 w-9 rounded-full bg-brand grid place-items-center text-brand-foreground font-semibold">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">João Silva</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">joao@empresa.com</p>
            </div>
            <Link to="/" className="p-1.5 rounded hover:bg-sidebar-accent" aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Novo Contrato</h1>
            <p className="text-xs text-muted-foreground">
              Preencha os dados e visualize o contrato em tempo real.
            </p>
          </div>
        </header>

        <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6 overflow-auto">
          {/* Form */}
          <section className="bg-card border rounded-xl p-6 space-y-5 h-fit">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tipo de Contrato</label>
              <select
                value={form.tipo}
                onChange={(e) => update("tipo", e.target.value as ContractType)}
                className="w-full h-11 px-3 rounded-md border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione um tipo…</option>
                {Object.entries(CONTRACT_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <FieldGroup title="Contratante (Cliente)">
              <Field
                label="Nome / Razão Social"
                value={form.contratanteNome}
                onChange={(v) => update("contratanteNome", v)}
                placeholder="Ex: Empresa XYZ LTDA"
              />
              <Field
                label="CPF / CNPJ"
                value={form.contratanteDoc}
                onChange={(v) => update("contratanteDoc", v)}
                placeholder="000.000.000-00"
              />
            </FieldGroup>

            <FieldGroup title="Contratado (Prestador)">
              <Field
                label="Nome / Razão Social"
                value={form.contratadoNome}
                onChange={(v) => update("contratadoNome", v)}
                placeholder="Seu nome ou empresa"
              />
              <Field
                label="CPF / CNPJ"
                value={form.contratadoDoc}
                onChange={(v) => update("contratadoDoc", v)}
                placeholder="000.000.000-00"
              />
            </FieldGroup>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Descrição do serviço</label>
              <textarea
                value={form.descricao}
                onChange={(e) => update("descricao", e.target.value)}
                placeholder="Descreva detalhadamente o serviço a ser prestado…"
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Valor do serviço (R$)"
                value={form.valor}
                onChange={(v) => update("valor", v)}
                placeholder="1.500,00"
              />
              <Field
                label="Forma de pagamento"
                value={form.pagamento}
                onChange={(v) => update("pagamento", v)}
                placeholder="Pix, Cartão, Parcelado…"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Prazo / Vigência"
                value={form.prazo}
                onChange={(v) => update("prazo", v)}
                placeholder="30 dias, 6 meses…"
              />
              <Field
                label="Foro (cidade)"
                value={form.foro}
                onChange={(v) => update("foro", v)}
                placeholder="São Paulo/SP"
              />
            </div>
          </section>

          {/* Preview */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">
                Pré-visualização em tempo real
              </h2>
              <button
                onClick={downloadPdf}
                disabled={!contract}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-brand text-brand-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                Gerar e Baixar PDF
              </button>
            </div>

            <div className="bg-muted/60 border rounded-xl p-4 sm:p-8 min-h-[900px]">
              <div
                className="mx-auto bg-white border border-neutral-300 shadow-sm"
                style={{
                  width: "100%",
                  maxWidth: "620px",
                  minHeight: "877px",
                  padding: "56px 60px",
                  color: "#1a1a1a",
                  fontFamily: "'Times New Roman', Georgia, serif",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                {!contract ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-32">
                    <FileText className="h-10 w-10 mb-3 text-neutral-400" />
                    <p className="font-sans text-sm max-w-xs">
                      Selecione o tipo de contrato e preencha os dados ao lado — o
                      documento aparecerá aqui em tempo real.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3
                      className="text-center font-bold uppercase mb-6"
                      style={{ fontSize: "14px", letterSpacing: "0.5px" }}
                    >
                      {contract.title}
                    </h3>
                    {contract.paragraphs.map((p, i) => {
                      const isHeading = /^CLÁUSULA/.test(p);
                      return (
                        <p
                          key={i}
                          className={isHeading ? "font-bold mt-4 mb-2" : "mb-3 text-justify"}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {p}
                        </p>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition text-left ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-md border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring transition text-sm"
      />
    </div>
  );
}
