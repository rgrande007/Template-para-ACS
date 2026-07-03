import { beforeEach, describe, expect, it } from "vitest";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

globalThis.localStorage = new MemoryStorage();

const {
  initializeDrafts,
  createDraft,
  renameDraft,
  deleteDraft,
  listDrafts,
  switchActiveDraft,
  saveDraftData,
  loadDraftData,
  getDraftNotionPageId,
  setDraftNotionPageId,
  clearDraftNotionPageId,
} = await import("./drafts");
const { createDefaultFormData } = await import("./formSchema");

beforeEach(() => {
  localStorage.clear();
});

describe("initializeDrafts", () => {
  it("creates a first empty draft when none exists", () => {
    const { activeId, data, drafts } = initializeDrafts();
    expect(drafts).toHaveLength(1);
    expect(drafts[0].id).toBe(activeId);
    expect(data.initial.studentName).toBe("");
  });

  it("migrates legacy single-draft data into the first draft", () => {
    const legacyData = createDefaultFormData();
    legacyData.initial.studentName = "Maria";
    localStorage.setItem("acs-paper-builder-form-data", JSON.stringify(legacyData));

    const { data, drafts } = initializeDrafts();
    expect(drafts).toHaveLength(1);
    expect(data.initial.studentName).toBe("Maria");
  });

  it("keeps the previously active draft on repeated calls", () => {
    const first = initializeDrafts();
    createDraft("Segundo paper");
    const second = initializeDrafts();
    expect(second.activeId).toBe(first.activeId);
    expect(second.drafts).toHaveLength(2);
  });
});

describe("draft CRUD", () => {
  it("creates, renames, and lists drafts", () => {
    createDraft("Paper A");
    createDraft("Paper B");
    renameDraft(listDrafts()[0].id, "Paper A renomeado");
    const names = listDrafts().map((d) => d.name).sort();
    expect(names).toEqual(["Paper A renomeado", "Paper B"]);
  });

  it("deletes a draft along with its data and Notion page id", () => {
    const draft = createDraft("Descartável");
    setDraftNotionPageId(draft.id, "notion-page-123");
    deleteDraft(draft.id);
    expect(listDrafts().find((d) => d.id === draft.id)).toBeUndefined();
    expect(getDraftNotionPageId(draft.id)).toBeUndefined();
  });

  it("keeps drafts independent from one another", () => {
    const a = createDraft("Paper A");
    const b = createDraft("Paper B");

    const dataA = createDefaultFormData();
    dataA.initial.studentName = "Aluno A";
    saveDraftData(a.id, dataA);

    const dataB = createDefaultFormData();
    dataB.initial.studentName = "Aluno B";
    saveDraftData(b.id, dataB);

    expect(loadDraftData(a.id).initial.studentName).toBe("Aluno A");
    expect(loadDraftData(b.id).initial.studentName).toBe("Aluno B");
  });

  it("switchActiveDraft returns that draft's saved data", () => {
    const a = createDraft("Paper A");
    const data = createDefaultFormData();
    data.initial.studentName = "Aluno A";
    saveDraftData(a.id, data);

    const loaded = switchActiveDraft(a.id);
    expect(loaded.initial.studentName).toBe("Aluno A");
  });
});

describe("per-draft Notion page id", () => {
  it("stores and clears independently per draft", () => {
    const a = createDraft("Paper A");
    const b = createDraft("Paper B");
    setDraftNotionPageId(a.id, "page-a");
    setDraftNotionPageId(b.id, "page-b");
    expect(getDraftNotionPageId(a.id)).toBe("page-a");
    expect(getDraftNotionPageId(b.id)).toBe("page-b");

    clearDraftNotionPageId(a.id);
    expect(getDraftNotionPageId(a.id)).toBeUndefined();
    expect(getDraftNotionPageId(b.id)).toBe("page-b");
  });
});
