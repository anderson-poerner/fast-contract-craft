export const COMPANY_STORAGE_KEY = "zapdocfy:minha-empresa";
export const LEGACY_COMPANY_STORAGE_KEY = "contratorapido:minha-empresa";
export const THEME_STORAGE_KEY = "zapdocfy:tema";

export interface CompanyProfile {
  nome: string;
  doc: string;
  endereco: string;
  email: string;
  telefone: string;
}

export const emptyCompanyProfile: CompanyProfile = {
  nome: "",
  doc: "",
  endereco: "",
  email: "",
  telefone: "",
};

export function loadCompanyProfile(): CompanyProfile {
  if (typeof window === "undefined") return emptyCompanyProfile;
  try {
    const raw = localStorage.getItem(COMPANY_STORAGE_KEY) ?? localStorage.getItem(LEGACY_COMPANY_STORAGE_KEY);
    if (!raw) return emptyCompanyProfile;
    const parsed = JSON.parse(raw) as Partial<CompanyProfile>;
    return {
      nome: parsed.nome ?? "",
      doc: parsed.doc ?? "",
      endereco: parsed.endereco ?? "",
      email: parsed.email ?? "",
      telefone: parsed.telefone ?? "",
    };
  } catch {
    return emptyCompanyProfile;
  }
}

export function saveCompanyProfile(profile: CompanyProfile) {
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(profile));
}

export function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}