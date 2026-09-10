import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FileSignature, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZapDocfy — Contratos rápidos e profissionais" },
      {
        name: "description",
        content:
          "Plataforma SaaS para profissionais autônomos e microempresas gerarem contratos de prestação de serviços profissionais em minutos.",
      },
      { property: "og:title", content: "ZapDocfy — Contratos rápidos e profissionais" },
      {
        property: "og:description",
        content: "Plataforma SaaS para profissionais autônomos e microempresas gerarem contratos de prestação de serviços profissionais em minutos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px circle at 20% 20%, oklch(0.55 0.16 255 / 0.35), transparent 60%), radial-gradient(500px circle at 80% 80%, oklch(0.35 0.10 260 / 0.5), transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-2 text-lg font-semibold">
          <div className="h-9 w-9 rounded-lg bg-brand grid place-items-center">
            <FileSignature className="h-5 w-5 text-brand-foreground" />
          </div>
          ZapDocfy
        </div>
        <div className="relative space-y-6 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Contratos profissionais em <span className="text-brand">segundos</span>.
          </h1>
          <p className="text-sidebar-foreground/70 text-base leading-relaxed">
            A ferramenta favorita de autônomos e microempresas para gerar contratos de
            prestação de serviços prontos para assinar.
          </p>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li>✓ Modelos jurídicos padronizados</li>
            <li>✓ Visualização em tempo real</li>
            <li>✓ Download em PDF pronto para impressão</li>
          </ul>
        </div>
        <p className="relative text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} ZapDocfy
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2 text-lg font-semibold">
            <div className="h-9 w-9 rounded-lg bg-brand grid place-items-center">
              <FileSignature className="h-5 w-5 text-brand-foreground" />
            </div>
            ZapDocfy
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h2>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para gerar contratos.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                className="w-full h-11 px-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Entrar <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            Ao entrar você concorda com nossos Termos de Uso.
          </p>
        </div>
      </div>
    </div>
  );
}
