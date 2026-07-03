import { PaperFormData } from "@/types/paper";
import { createDefaultFormData } from "@/lib/formSchema";

export interface DraftMeta {
  id: string;
  name: string;
  updatedAt: string;
}

const REGISTRY_KEY = "acs-paper-builder-drafts";
const ACTIVE_DRAFT_KEY = "acs-paper-builder-active-draft-id";
/** Chave usada antes de existir suporte a múltiplos rascunhos — migrada no primeiro carregamento. */
const LEGACY_STORAGE_KEY = "acs-paper-builder-form-data";

const draftDataKey = (id: string) => `acs-paper-builder-draft-${id}`;
const draftNotionPageKey = (id: string) => `acs-paper-builder-notion-page-id-${id}`;

function generateId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadRegistry(): DraftMeta[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegistry(drafts: DraftMeta[]) {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(drafts));
  } catch {
    // localStorage indisponível: ignora
  }
}

function setActiveDraftId(id: string) {
  try {
    localStorage.setItem(ACTIVE_DRAFT_KEY, id);
  } catch {
    // ignora
  }
}

export function loadDraftData(id: string): PaperFormData {
  try {
    const raw = localStorage.getItem(draftDataKey(id));
    if (!raw) return createDefaultFormData();
    return { ...createDefaultFormData(), ...JSON.parse(raw) };
  } catch {
    return createDefaultFormData();
  }
}

export function saveDraftData(id: string, data: PaperFormData) {
  try {
    localStorage.setItem(draftDataKey(id), JSON.stringify(data));
  } catch {
    // localStorage indisponível ou cota excedida: progresso não será persistido
    return;
  }
  const registry = loadRegistry();
  const updated = registry.map((d) => (d.id === id ? { ...d, updatedAt: new Date().toISOString() } : d));
  saveRegistry(updated);
}

export function listDrafts(): DraftMeta[] {
  return loadRegistry().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createDraft(name: string, data: PaperFormData = createDefaultFormData()): DraftMeta {
  const meta: DraftMeta = { id: generateId(), name: name.trim() || "Rascunho sem nome", updatedAt: new Date().toISOString() };
  saveRegistry([...loadRegistry(), meta]);
  saveDraftData(meta.id, data);
  return meta;
}

export function renameDraft(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  saveRegistry(loadRegistry().map((d) => (d.id === id ? { ...d, name: trimmed } : d)));
}

export function deleteDraft(id: string) {
  saveRegistry(loadRegistry().filter((d) => d.id !== id));
  try {
    localStorage.removeItem(draftDataKey(id));
    localStorage.removeItem(draftNotionPageKey(id));
  } catch {
    // ignora
  }
}

export function switchActiveDraft(id: string): PaperFormData {
  setActiveDraftId(id);
  return loadDraftData(id);
}

export function getDraftNotionPageId(id: string): string | undefined {
  try {
    return localStorage.getItem(draftNotionPageKey(id)) ?? undefined;
  } catch {
    return undefined;
  }
}

export function setDraftNotionPageId(id: string, pageId: string) {
  try {
    localStorage.setItem(draftNotionPageKey(id), pageId);
  } catch {
    // ignora
  }
}

export function clearDraftNotionPageId(id: string) {
  try {
    localStorage.removeItem(draftNotionPageKey(id));
  } catch {
    // ignora
  }
}

/**
 * Garante que exista pelo menos um rascunho e retorna qual está ativo, migrando dados
 * de versões anteriores do app (que guardavam um único rascunho sob outra chave).
 */
export function initializeDrafts(): { activeId: string; data: PaperFormData; drafts: DraftMeta[] } {
  let registry = loadRegistry();

  if (registry.length === 0) {
    let initialData = createDefaultFormData();
    try {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) initialData = { ...createDefaultFormData(), ...JSON.parse(legacy) };
    } catch {
      // dado legado corrompido: ignora e começa vazio
    }
    const meta = createDraft("Rascunho 1", initialData);
    registry = [meta];
  }

  let activeId: string | null = null;
  try {
    activeId = localStorage.getItem(ACTIVE_DRAFT_KEY);
  } catch {
    activeId = null;
  }
  if (!activeId || !registry.some((d) => d.id === activeId)) {
    activeId = registry[0].id;
  }
  setActiveDraftId(activeId);

  return { activeId, data: loadDraftData(activeId), drafts: listDrafts() };
}
