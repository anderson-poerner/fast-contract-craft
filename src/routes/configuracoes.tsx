import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Building2, Check, FileSignature, Moon, Save, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  applyTheme,
  emptyCompanyProfile,
  loadCompanyProfile,
  saveCompanyProfile,
  THEME_STORAGE_KEY,
  type CompanyProfile,
} from "@/lib/app-preferences";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — ZapDocfy" },
      { name: "description", content: "Configure os dados da sua empresa e a aparência do ZapDocfy." },
      { property: "og:title", content: "Configurações — ZapDocfy" },
      { property: "og:description", content: "Configure os dados da sua empresa e a aparência do ZapDocfy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const [profile, setProfile] = useState<CompanyProfile>(emptyCompanyProfile);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadCompanyProfile());
    setDark(localStorage.getItem(THEME_STORAGE_KEY) === "dark" || document.documentElement.classList.contains("dark"));
  }, []);

  const update = (key: keyof CompanyProfile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveCompanyProfile(profile);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand">
              <FileSignature className="h-4 w-4 text-brand-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold sm:text-lg">Configurações</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Personalize sua empresa e sua experiência.</p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0 px-2.5 sm:px-3">
            <Link to="/dashboard"><ArrowLeft /> <span className="whitespace-nowrap">Voltar ao painel</span></Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <section className="border-b pb-6">
          <div className="mb-5 flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <h2 className="font-semibold">Dados da Minha Empresa / Contratado</h2>
              <p className="mt-1 text-sm text-muted-foreground">Estas informações serão incluídas automaticamente em todos os novos contratos.</p>
            </div>
          </div>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <SettingField label="Nome / Razão Social" value={profile.nome} onChange={(value) => update("nome", value)} placeholder="Nome do prestador ou empresa" required />
            <SettingField label="CPF / CNPJ" value={profile.doc} onChange={(value) => update("doc", value)} placeholder="000.000.000-00" required />
            <div className="sm:col-span-2"><SettingField label="Endereço" value={profile.endereco} onChange={(value) => update("endereco", value)} placeholder="Rua, número, bairro, cidade e UF" /></div>
            <SettingField label="E-mail" value={profile.email} onChange={(value) => update("email", value)} placeholder="contato@empresa.com" type="email" />
            <SettingField label="Telefone / WhatsApp" value={profile.telefone} onChange={(value) => update("telefone", value)} placeholder="(00) 00000-0000" />
            <div className="flex items-center gap-3 sm:col-span-2">
              <Button type="submit"><Save /> Salvar dados</Button>
              {saved && <span className="inline-flex items-center gap-1.5 text-sm text-status-signed"><Check className="h-4 w-4" /> Dados salvos</span>}
            </div>
          </form>
        </section>

        <section className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {dark ? <Moon className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> : <Sun className="mt-0.5 h-5 w-5 shrink-0 text-brand" />}
            <div>
              <h2 className="font-semibold">Aparência</h2>
              <p className="mt-1 text-sm text-muted-foreground">Alternar entre Modo Claro e Modo Escuro.</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-sm font-medium sm:inline">{dark ? "Modo Escuro" : "Modo Claro"}</span>
            <Switch aria-label="Alternar modo escuro" checked={dark} onCheckedChange={(checked) => { setDark(checked); applyTheme(checked ? "dark" : "light"); }} />
          </div>
        </section>
      </main>
    </div>
  );
}

function SettingField({ label, value, onChange, placeholder, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; required?: boolean }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span><input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring" /></label>;
}