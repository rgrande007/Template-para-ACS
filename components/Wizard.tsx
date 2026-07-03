"use client";

import { useEffect, useRef, useState } from "react";
import { NotionSaveStatus, PaperFormData } from "@/types/paper";
import { STEP_META, createDefaultFormData } from "@/lib/formSchema";
import { generateMarkdown } from "@/lib/generateMarkdown";
import { computeCompletion, computeSectionCompletion } from "@/lib/progress";
import {
  DraftMeta,
  clearDraftNotionPageId,
  createDraft,
  deleteDraft,
  getDraftNotionPageId,
  initializeDrafts,
  listDrafts,
  renameDraft,
  saveDraftData,
  setDraftNotionPageId,
  switchActiveDraft,
} from "@/lib/drafts";
import SectionNav from "@/components/SectionNav";
import CompletionBadge from "@/components/CompletionBadge";
import DraftSwitcher from "@/components/DraftSwitcher";
import LivePreview from "@/components/LivePreview";
import MarkdownPreview from "@/components/MarkdownPreview";
import ResizeHandle from "@/components/ResizeHandle";
import StepCard from "@/components/StepCard";
import StepInitial from "@/components/steps/StepInitial";
import StepCentralSentence from "@/components/steps/StepCentralSentence";
import StepTitle from "@/components/steps/StepTitle";
import StepAbstract from "@/components/steps/StepAbstract";
import StepIntroduction from "@/components/steps/StepIntroduction";
import StepMethods from "@/components/steps/StepMethods";
import StepResults from "@/components/steps/StepResults";
import StepConclusions from "@/components/steps/StepConclusions";
import StepSupportingInfo from "@/components/steps/StepSupportingInfo";
import StepNavigation from "@/components/StepNavigation";

const NAV_SECTIONS = STEP_META.map((s) => ({ id: s.id, title: s.title })).concat([
  { id: "review", title: "Revisão e envio" },
]);

const PREVIEW_WIDTH_KEY = "acs-paper-builder-preview-width";
const MIN_PREVIEW_WIDTH = 280;
const MAX_PREVIEW_WIDTH = 640;
const DEFAULT_PREVIEW_WIDTH = 416;
const SUBMISSION_TOKEN_KEY = "acs-paper-builder-submission-token";

export default function Wizard() {
  const [formData, setFormData] = useState<PaperFormData>(createDefaultFormData());
  const [drafts, setDrafts] = useState<DraftMeta[]>([]);
  const [activeDraftId, setActiveDraftId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0].id);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<NotionSaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewWidth, setPreviewWidth] = useState(DEFAULT_PREVIEW_WIDTH);
  const layoutRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    try {
      const { activeId, data, drafts: loadedDrafts } = initializeDrafts();
      setActiveDraftId(activeId);
      setFormData(data);
      setDrafts(loadedDrafts);

      const savedWidth = Number(localStorage.getItem(PREVIEW_WIDTH_KEY));
      if (Number.isFinite(savedWidth) && savedWidth >= MIN_PREVIEW_WIDTH && savedWidth <= MAX_PREVIEW_WIDTH) {
        setPreviewWidth(savedWidth);
      }
    } catch {
      // localStorage indisponível ou dados corrompidos: mantém os valores padrão
    } finally {
      setLoaded(true);
    }

    const hash = window.location.hash.replace("#", "");
    if (NAV_SECTIONS.some((s) => s.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  const goToSection = (id: string) => {
    setActiveSection(id);
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      // ambiente sem suporte a history API: ignora
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Ao trocar de aba, o conteúdo antigo é desmontado — sem isto, o foco do teclado
    // fica "perdido" (volta ao body), o que é silenciosamente ruim para quem navega
    // por teclado ou leitor de tela. Não roda na primeira renderização para não
    // roubar o foco do usuário assim que a página carrega.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [activeSection]);

  const persistPreviewWidth = (width: number) => {
    try {
      localStorage.setItem(PREVIEW_WIDTH_KEY, String(width));
    } catch {
      // localStorage indisponível: ignora
    }
  };

  const handleDividerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const STEP = 24;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPreviewWidth((width) => {
        const next = Math.min(MAX_PREVIEW_WIDTH, width + STEP);
        persistPreviewWidth(next);
        return next;
      });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPreviewWidth((width) => {
        const next = Math.max(MIN_PREVIEW_WIDTH, width - STEP);
        persistPreviewWidth(next);
        return next;
      });
    }
  };

  const handleDividerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const handleMove = (moveEvent: PointerEvent) => {
      const container = layoutRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newWidth = rect.right - moveEvent.clientX;
      setPreviewWidth(Math.min(MAX_PREVIEW_WIDTH, Math.max(MIN_PREVIEW_WIDTH, newWidth)));
    };

    const handleUp = () => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", handleMove);
      handle.removeEventListener("pointerup", handleUp);
      document.body.style.userSelect = previousUserSelect;
      setPreviewWidth((width) => {
        persistPreviewWidth(width);
        return width;
      });
    };

    handle.addEventListener("pointermove", handleMove);
    handle.addEventListener("pointerup", handleUp);
  };

  useEffect(() => {
    if (!loaded || !activeDraftId) return;
    saveDraftData(activeDraftId, formData);
    setDrafts(listDrafts());
  }, [formData, loaded, activeDraftId]);

  const handleClear = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja limpar este rascunho? Essa ação não pode ser desfeita."
    );
    if (!confirmed) return;
    const defaults = createDefaultFormData();
    setFormData(defaults);
    saveDraftData(activeDraftId, defaults);
    clearDraftNotionPageId(activeDraftId);
    setDrafts(listDrafts());
  };

  const handleSwitchDraft = (id: string) => {
    if (id === activeDraftId) return;
    const data = switchActiveDraft(id);
    setActiveDraftId(id);
    setFormData(data);
  };

  const handleCreateDraft = () => {
    const name = window.prompt("Nome do novo rascunho:", `Rascunho ${drafts.length + 1}`);
    if (!name) return;
    const meta = createDraft(name);
    setDrafts(listDrafts());
    handleSwitchDraft(meta.id);
  };

  const handleRenameDraft = (id: string) => {
    const current = drafts.find((d) => d.id === id);
    const name = window.prompt("Novo nome do rascunho:", current?.name ?? "");
    if (!name) return;
    renameDraft(id, name);
    setDrafts(listDrafts());
  };

  const handleDeleteDraft = (id: string) => {
    const target = drafts.find((d) => d.id === id);
    const confirmed = window.confirm(
      `Excluir o rascunho "${target?.name ?? ""}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    deleteDraft(id);
    const remaining = listDrafts();
    setDrafts(remaining);
    if (id === activeDraftId && remaining.length > 0) {
      handleSwitchDraft(remaining[0].id);
    }
  };

  const handleDownloadBackup = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const draftName = drafts.find((d) => d.id === activeDraftId)?.name;
    const slug =
      (draftName || formData.initial.studentName).trim().replace(/\s+/g, "-").toLowerCase() || "rascunho";
    const a = document.createElement("a");
    a.href = url;
    a.download = `acs-paper-builder-${slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (file: File) => {
    const confirmed = window.confirm(
      "Importar este arquivo vai substituir todas as respostas atuais do formulário. Deseja continuar?"
    );
    if (!confirmed) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setFormData({ ...createDefaultFormData(), ...parsed });
      } catch {
        window.alert("Não foi possível ler este arquivo. Verifique se é um backup válido do ACS Paper Builder.");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!mobilePreviewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobilePreviewOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    // Trava o scroll da página por trás do preview em tela cheia, para não confundir
    // com duas áreas roláveis sobrepostas.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobilePreviewOpen]);

  const markdown = generateMarkdown(formData);
  const completion = computeCompletion(formData);
  const sectionCompletion = computeSectionCompletion(formData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const postToNotion = async (token: string) => {
    const notionPageId = getDraftNotionPageId(activeDraftId);
    return fetch("/api/create-paper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "x-submission-token": token }),
      },
      body: JSON.stringify({ data: formData, notionPageId }),
    });
  };

  const handleSaveToNotion = async () => {
    setSaveStatus("saving");
    setErrorMessage("");
    try {
      let token = localStorage.getItem(SUBMISSION_TOKEN_KEY) ?? "";
      let response = await postToNotion(token);

      if (response.status === 401) {
        const entered = window.prompt("Digite o código de submissão fornecido pelo professor:");
        if (!entered) {
          setSaveStatus("error");
          setErrorMessage("Código de submissão necessário para salvar no Notion.");
          return;
        }
        token = entered.trim();
        localStorage.setItem(SUBMISSION_TOKEN_KEY, token);
        response = await postToNotion(token);
      }

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Falha ao salvar no Notion.");
      }
      if (result.pageId) {
        setDraftNotionPageId(activeDraftId, result.pageId);
      }
      setSaveStatus("success");
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido.");
    }
  };

  const activeIndex = NAV_SECTIONS.findIndex((s) => s.id === activeSection);
  const previousSection = activeIndex > 0 ? NAV_SECTIONS[activeIndex - 1] : null;
  const nextSection = activeIndex < NAV_SECTIONS.length - 1 ? NAV_SECTIONS[activeIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20">
        <header className="border-b border-stone-200 bg-paper/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-lg font-bold text-ink sm:text-xl">ACS Paper Builder</h1>
              {activeDraftId && (
                <DraftSwitcher
                  drafts={drafts}
                  activeDraftId={activeDraftId}
                  onSwitch={handleSwitchDraft}
                  onCreate={handleCreateDraft}
                  onRename={handleRenameDraft}
                  onDelete={handleDeleteDraft}
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CompletionBadge percentage={completion} />
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-stone-100"
              >
                {copied ? "Copiado!" : "Copiar Markdown"}
              </button>
              <button
                type="button"
                onClick={handleSaveToNotion}
                disabled={saveStatus === "saving"}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveStatus === "saving" ? "Salvando..." : "Salvar no Notion"}
              </button>
              <button
                type="button"
                onClick={handleDownloadBackup}
                title="Baixa um arquivo com todas as respostas atuais, para não depender só do navegador"
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-stone-100"
              >
                Baixar rascunho
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Restaura as respostas a partir de um arquivo baixado antes"
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-stone-100"
              >
                Importar rascunho
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportBackup(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-muted underline hover:text-accent"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(true)}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-stone-100 lg:hidden"
              >
                Prévia
              </button>
            </div>
          </div>
          <div aria-live="polite">
            {saveStatus === "success" && (
              <p className="mx-auto mt-2 max-w-7xl text-xs font-medium text-green-700">
                Paper salvo com sucesso no Notion.
              </p>
            )}
            {saveStatus === "error" && (
              <p className="mx-auto mt-2 max-w-7xl text-xs font-medium text-red-700">
                Não foi possível salvar no Notion: {errorMessage}
              </p>
            )}
          </div>
        </header>

        <SectionNav
          sections={NAV_SECTIONS}
          activeId={activeSection}
          onSelect={goToSection}
          completion={sectionCompletion}
        />
      </div>

      <div
        ref={layoutRef}
        className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-3"
      >
        <main ref={mainRef} id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
        <div key={activeSection} className="motion-safe:animate-section-enter">
          {activeSection === "initial" && (
            <StepInitial data={formData.initial} onChange={(initial) => setFormData({ ...formData, initial })} />
          )}
          {activeSection === "central-sentence" && (
            <StepCentralSentence
              data={formData.centralSentence}
              onChange={(centralSentence) => setFormData({ ...formData, centralSentence })}
            />
          )}
          {activeSection === "title" && (
            <StepTitle
              data={formData.title}
              onChange={(title) => setFormData({ ...formData, title })}
              centralSentence={formData.centralSentence}
            />
          )}
          {activeSection === "abstract" && (
            <StepAbstract
              data={formData.abstract}
              onChange={(abstract) => setFormData({ ...formData, abstract })}
              centralSentence={formData.centralSentence}
            />
          )}
          {activeSection === "introduction" && (
            <StepIntroduction
              data={formData.introduction}
              onChange={(introduction) => setFormData({ ...formData, introduction })}
              centralSentence={formData.centralSentence}
            />
          )}
          {activeSection === "methods" && (
            <StepMethods data={formData.methods} onChange={(methods) => setFormData({ ...formData, methods })} />
          )}
          {activeSection === "results" && (
            <StepResults data={formData.results} onChange={(results) => setFormData({ ...formData, results })} />
          )}
          {activeSection === "conclusions" && (
            <StepConclusions
              data={formData.conclusions}
              onChange={(conclusions) => setFormData({ ...formData, conclusions })}
            />
          )}
          {activeSection === "supporting-info" && (
            <StepSupportingInfo
              data={formData.supportingInfo}
              onChange={(supportingInfo) => setFormData({ ...formData, supportingInfo })}
            />
          )}
          {activeSection === "review" && (
            <StepCard
              title="Revisão e envio"
              objective="Esqueleto completo do paper em Markdown. Revise cuidadosamente antes de copiar ou salvar — isto é um rascunho estrutural, não uma versão final pronta para submissão."
            >
              <MarkdownPreview markdown={markdown} />
            </StepCard>
          )}
        </div>

          <StepNavigation previous={previousSection} next={nextSection} onNavigate={goToSection} />
        </main>

        <ResizeHandle
          onPointerDown={handleDividerPointerDown}
          onKeyDown={handleDividerKeyDown}
          valueNow={previewWidth}
          valueMin={MIN_PREVIEW_WIDTH}
          valueMax={MAX_PREVIEW_WIDTH}
        />

        <aside
          style={{ width: previewWidth }}
          className="paper-texture sticky top-24 hidden h-[calc(100vh-7rem)] shrink-0 overflow-y-auto rounded-xl bg-white p-8 shadow-[0_12px_36px_-8px_rgba(31,41,51,0.22)] ring-1 ring-stone-200/80 lg:block"
        >
          <LivePreview data={formData} />
        </aside>
      </div>

      {mobilePreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Prévia do paper"
          className="fixed inset-0 z-30 bg-paper lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <span className="text-sm font-semibold text-ink">Prévia do paper</span>
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink hover:bg-stone-100"
            >
              Fechar
            </button>
          </div>
          <div className="paper-texture relative h-[calc(100vh-3.25rem)] overflow-y-auto bg-white p-6">
            <LivePreview data={formData} />
          </div>
        </div>
      )}
    </div>
  );
}
