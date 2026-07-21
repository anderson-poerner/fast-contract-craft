import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileSignature, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { buildContract, type FormState } from "@/lib/contract-builder";
import { getContract, signContract } from "@/lib/contracts.functions";

export const Route = createFileRoute("/view/contract/$id")({
  head: () => ({
    meta: [
      { title: "Visualizar contrato — ContratoRápido" },
      { name: "description", content: "Leia e assine seu contrato eletronicamente." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ params }) => {
    const data = await getContract({ data: { id: params.id } });
    if (!data) throw notFound();
    return { contract: data };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">Não foi possível carregar o contrato</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Contrato não encontrado</h1>
        <p className="text-sm text-muted-foreground mt-2">
          O link pode ter expirado ou o contrato foi removido.
        </p>
      </div>
    </div>
  ),
  component: ViewContract,
});

function ViewContract() {
  const { contract: initial } = Route.useLoaderData();
  const params = Route.useParams();
  const sign = useServerFn(signContract);

  const [row, setRow] = useState(initial);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = row.form_data as FormState;
  const built = buildContract(form);
  const isSigned = row.status === "signed";

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 3) return setError("Informe seu nome completo.");
    if (cpf.trim().length < 6) return setError("Informe um CPF válido.");
    setLoading(true);
    try {
      const res = await sign({ data: { id: params.id, name: name.trim(), cpf: cpf.trim() } });
      setRow({
        ...row,
        status: "signed",
        signer_name: name.trim(),
        signer_cpf: cpf.trim(),
        signer_ip: res.ip,
        signed_at: res.signed_at,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatCpf = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="h-16 bg-card border-b flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-brand grid place-items-center">
            <FileSignature className="h-4 w-4 text-brand-foreground" />
          </div>
          <span className="font-semibold">ContratoRápido</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-8">
        <div
          className="bg-white border border-neutral-300 shadow-sm mx-auto"
          style={{
            padding: "56px 60px",
            color: "#1a1a1a",
            fontFamily: "'Times New Roman', Georgia, serif",
            fontSize: "13px",
            lineHeight: 1.7,
          }}
        >
          {built && (
            <>
              <h1 className="text-center font-bold uppercase mb-6" style={{ fontSize: "16px", letterSpacing: "0.5px" }}>
                {built.title}
              </h1>
              {built.paragraphs.map((p, i) => {
                const isHeading = /^CLÁUSULA/.test(p);
                return (
                  <p key={i} className={isHeading ? "font-bold mt-4 mb-2" : "mb-3 text-justify"} style={{ whiteSpace: "pre-line" }}>
                    {p}
                  </p>
                );
              })}
            </>
          )}

          {isSigned && (
            <div className="mt-10 border-2 border-neutral-800 p-5 bg-neutral-50">
              <div className="flex items-center gap-2 font-bold uppercase mb-3" style={{ fontSize: "12px" }}>
                <ShieldCheck className="h-4 w-4" />
                Assinatura Eletrônica — Registro Digital
              </div>
              <div style={{ fontSize: "12px" }} className="space-y-1">
                <p><strong>Assinado por:</strong> {row.signer_name}</p>
                <p><strong>CPF:</strong> {row.signer_cpf}</p>
                <p>
                  <strong>Data/Hora:</strong>{" "}
                  {row.signed_at ? new Date(row.signed_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) + " (horário de Brasília)" : "—"}
                </p>
                <p><strong>Endereço IP:</strong> {row.signer_ip || "não capturado"}</p>
                <p><strong>ID do contrato:</strong> {row.id}</p>
              </div>
              <p className="mt-3 text-neutral-600" style={{ fontSize: "11px" }}>
                Este documento foi aceito eletronicamente nos termos do art. 10, § 2º da MP nº 2.200-2/2001,
                que reconhece a validade jurídica de assinaturas eletrônicas mediante comprovação de autoria e integridade.
              </p>
            </div>
          )}
        </div>

        {/* Signature card */}
        <div className="mt-6 bg-card border rounded-xl p-6 shadow-sm">
          {isSigned ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
              <div>
                <h2 className="font-semibold text-lg">Contrato assinado com sucesso</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  A assinatura eletrônica foi registrada no rodapé do documento acima com data, hora e IP.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <h2 className="font-semibold text-lg">Assinatura Eletrônica</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Ao clicar em <strong>“Aceitar e Assinar Contrato”</strong>, você declara ter lido e concordado
                com todas as cláusulas acima. Sua identificação, data/hora e endereço IP serão registrados
                como prova da assinatura eletrônica.
              </p>
              <form onSubmit={handleSign} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Como no documento oficial"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">CPF</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                      placeholder="000.000.000-00"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-brand text-brand-foreground font-medium hover:opacity-90 disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {loading ? "Registrando assinatura…" : "Aceitar e Assinar Contrato"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
