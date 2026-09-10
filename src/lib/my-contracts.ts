const KEY = "zapdocfy:meus-contratos";
const SEEN_KEY = "zapdocfy:assinaturas-vistas";
const LEGACY_KEY = "contratorapido:meus-contratos";
const LEGACY_SEEN_KEY = "contratorapido:assinaturas-vistas";

export interface LocalContract {
  id: string;
  titulo: string;
  cliente: string;
  criadoEm: string;
}

export function listLocalContracts(): LocalContract[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    return raw ? (JSON.parse(raw) as LocalContract[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalContract(item: LocalContract) {
  const all = listLocalContracts().filter((c) => c.id !== item.id);
  localStorage.setItem(KEY, JSON.stringify([item, ...all].slice(0, 200)));
}

export function removeLocalContract(id: string) {
  localStorage.setItem(KEY, JSON.stringify(listLocalContracts().filter((c) => c.id !== id)));
}

export function getSeenSignatures(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEEN_KEY) ?? localStorage.getItem(LEGACY_SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markSignaturesSeen(ids: string[]) {
  const set = new Set([...getSeenSignatures(), ...ids]);
  localStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
}
