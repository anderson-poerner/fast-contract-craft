import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  FileSignature,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { buildContract, type FormState } from "@/lib/contract-builder";
import { getContractsByIds } from "@/lib/contracts.functions";
import { downloadContractPdf } from "@/lib/contract-pdf";
import {
  listLocalContracts,
  removeLocalContract,
  getSeenSignatures,
  markSignaturesSeen,
} from "@/lib/my-contracts";

export const Route = createFileRoute("/contratos")({
  head: () => ({
    meta: [
      { title: "Meus Contratos — ContratoRápido" },
      {
        name: "description",
        content: "Acompanhe o status de assinatura dos seus contratos e baixe a via assinada.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MeusContratos,
});

type Row = {
  id: string;
  form_data: unknown;
  status: string;
  signer_name: string | null;
  signer_cpf: string | null;
  signer_ip: string | null;
  signed_at: string | null;
  created_at: string;
};

function MeusContratos() {
  const fetchContracts = useServerFn(getContractsByIds);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [novasAssinaturas, setNovasAssinaturas] = useState<Row[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const ids = listLocalContracts().map((c) => c.id);
    if (ids.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }
    try {
      const data = (await fetchContracts({ data: { ids } })) as Row[];
      setRows(data);
      const seen = getSeenSignatures();
      const novas = data.filter((r) => r.status === "signed" && !seen.includes(r.id));
      if (novas.length) setNovasAssinaturas(novas);
    } catch {
      /* silencioso */
    } finally {
      setLoading(false);
    }
  }, [fetchContracts]);

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const confirmarLeitura = () => {
    markSignaturesSeen(novasAssinaturas.map((r) => r.id));
    setNovasAssinaturas([]);
  };

  const baixar = (row: Row) => {
    const built = buildContract(row.form_data as FormState);
    if (!built) return;
    downloadContractPdf(
      built,
      row.status === "signed"
        ? {
            name: row.signer_name,
            cpf: row.signer_cpf,
            ip: row.signer_ip,
            signedAt: row.signed_at,
            id: row.id,
          }
        : null,
      row.status === "signed" ? `contrato-assinado-${row.id.slice(0, 8)}.pdf` : `contrato-${row.id.slice(0, 8)}.pdf`,
    );
  };

  const copiar = async (id: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/view/contract/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const excluir = (id: string) => {
    removeLocalContract(id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-brand grid place-items-center">
            <FileSignature className="h-4 w-4 text-brand-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Meus Contratos</h1>
            <p className="text-xs text-muted-foreground">
              Acompanhe o aceite dos clientes e baixe a via assinada.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md border bg-card hover:bg-muted transition text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-brand text-brand-foreground hover:opacity-90 transition text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao painel
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-4">
        {novasAssinaturas.length > 0 && (
          <div className="rounded-xl border border-green-600/40 bg-green-50 dark:bg-green-950/30 p-4 flex flex-wrap items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm flex-1 min-w-0">
              <strong>{novasAssinaturas.length}</strong>{" "}
              {novasAssinaturas.length === 1 ? "contrato foi assinado" : "contratos foram assinados"} pelo
              cliente. Baixe a via com o carimbo de assinatura abaixo.
            </p>
            <button
              onClick={confirmarLeitura}
              className="h-8 px-3 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition"
            >
              Marcar como visto
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando contratos…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium">Nenhum contrato gerado ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie um contrato no painel e gere o link de assinatura para enviá-lo pelo WhatsApp.
            </p>
          </div>
        ) : (
          rows.map((row) => {
            const built = buildContract(row.form_data as FormState);
            const f = row.form_data as FormState;
            const assinado = row.status === "signed";
            return (
              <article key={row.id} className="rounded-xl border bg-card p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-medium truncate">{built?.title ?? "Contrato"}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Cliente: {f?.contratanteNome || "—"} · Criado em{" "}
                      {new Date(row.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium ${
                      assinado
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    }`}
                  >
                    {assinado ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {assinado ? "Assinado" : "Aguardando assinatura"}
                  </span>
                </div>

                {assinado && (
                  <div className="rounded-lg bg-muted/60 p-3 text-xs space-y-1">
                    <p>
                      <strong>Assinado por:</strong> {row.signer_name} — CPF {row.signer_cpf}
                    </p>
                    <p>
                      <strong>Data/Hora:</strong>{" "}
                      {row.signed_at
                        ? new Date(row.signed_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                        : "—"}{" "}
                      · <strong>IP:</strong> {row.signer_ip || "não capturado"}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => baixar(row)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {assinado ? "Baixar via assinada (PDF)" : "Baixar PDF"}
                  </button>
                  <a
                    href={`/view/contract/${row.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border hover:bg-muted transition text-xs font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir contrato
                  </a>
                  <button
                    onClick={() => copiar(row.id)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border hover:bg-muted transition text-xs font-medium"
                  >
                    {copied === row.id ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied === row.id ? "Copiado!" : "Copiar link"}
                  </button>
                  <button
                    onClick={() => excluir(row.id)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border hover:bg-muted transition text-xs font-medium text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover da lista
                  </button>
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
