import { Client } from "@notionhq/client";
import type {
  BlockObjectRequest,
} from "@notionhq/client/build/src/api-endpoints";
import { PaperFormData } from "@/types/paper";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

function getClient(): Client {
  if (!NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY não está configurada no servidor.");
  }
  return new Client({ auth: NOTION_API_KEY });
}

function truncateTitle(text: string, max = 200): string {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

const RICH_TEXT_CHUNK_SIZE = 2000;

/**
 * Divide o texto em blocos de até 2000 caracteres (limite do Notion por rich_text),
 * em vez de truncar, para não perder conteúdo de respostas longas.
 */
function richText(text: string) {
  if (!text) return [];
  const chunks: { type: "text"; text: { content: string } }[] = [];
  for (let i = 0; i < text.length; i += RICH_TEXT_CHUNK_SIZE) {
    chunks.push({ type: "text", text: { content: text.slice(i, i + RICH_TEXT_CHUNK_SIZE) } });
  }
  return chunks;
}

/**
 * Converte o markdown gerado em blocos do Notion.
 * Suporta apenas os elementos usados por generateMarkdown: #, ##, "- item" e parágrafos.
 */
function markdownToBlocks(markdown: string): BlockObjectRequest[] {
  const lines = markdown.split("\n");
  const blocks: BlockObjectRequest[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: richText(line.slice(3)) },
      } as BlockObjectRequest);
    } else if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: richText(line.slice(2)) },
      } as BlockObjectRequest);
    } else if (line.startsWith("- ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: richText(line.slice(2)) },
      } as BlockObjectRequest);
    } else {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: richText(line) },
      } as BlockObjectRequest);
    }
  }

  return blocks;
}

const NOTION_CHILDREN_LIMIT = 100;

function buildProperties(data: PaperFormData) {
  const title = data.title.finalTitle?.trim() || "Paper sem título";
  return {
    Title: {
      title: [{ type: "text" as const, text: { content: truncateTitle(title) } }],
    },
    Aluno: {
      rich_text: richText(data.initial.studentName),
    },
    "Revista alvo": {
      rich_text: richText(data.initial.targetJournal),
    },
    Status: {
      select: { name: "Rascunho" },
    },
    "Frase central": {
      rich_text: richText(data.centralSentence.centralSentence),
    },
    "Introdução preenchida": {
      checkbox: Object.values(data.introduction).some((v) => v.trim().length > 0),
    },
    "Resultados preenchidos": {
      checkbox: data.results.figures.some(
        (f) => f.atomicSentence.trim().length > 0 || f.mainObservation.trim().length > 0
      ),
    },
    "Conclusão preenchida": {
      checkbox:
        data.conclusions.mainAnswer.trim().length > 0 ||
        data.conclusions.fieldChange.trim().length > 0,
    },
  };
}

async function appendBlocksInBatches(notion: Client, pageId: string, blocks: BlockObjectRequest[]) {
  for (let i = 0; i < blocks.length; i += NOTION_CHILDREN_LIMIT) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks.slice(i, i + NOTION_CHILDREN_LIMIT),
    });
  }
}

function revisionHeading(label: string): BlockObjectRequest[] {
  return [
    { object: "block", type: "divider", divider: {} } as BlockObjectRequest,
    {
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: richText(`${label} — ${new Date().toLocaleString("pt-BR")}`) },
    } as BlockObjectRequest,
  ];
}

/**
 * Cria uma página nova no Notion, ou — se existingPageId for informado — atualiza as
 * propriedades e ANEXA a versão atual como uma nova revisão no fim da página, em vez de
 * sobrescrever o conteúdo. Isso evita duplicar páginas a cada clique em "Salvar no Notion"
 * sem apagar o histórico de evolução do rascunho do aluno.
 */
export async function createOrUpdatePaperPage(
  data: PaperFormData,
  markdown: string,
  existingPageId?: string
): Promise<{ id: string; isUpdate: boolean }> {
  if (!NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID não está configurada no servidor.");
  }

  const notion = getClient();
  const blocks = markdownToBlocks(markdown);
  const properties = buildProperties(data);

  if (existingPageId) {
    const page = await notion.pages.update({
      page_id: existingPageId,
      properties,
    });
    await appendBlocksInBatches(notion, page.id, [
      ...revisionHeading("Revisão"),
      ...blocks,
    ]);
    return { id: page.id, isUpdate: true };
  }

  const page = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      ...properties,
      "Data de criação": {
        date: { start: new Date().toISOString().split("T")[0] },
      },
    },
    children: [],
  });
  await appendBlocksInBatches(notion, page.id, [...revisionHeading("Versão inicial"), ...blocks]);
  return { id: page.id, isUpdate: false };
}
