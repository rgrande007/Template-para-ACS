import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDefaultFormData } from "./formSchema";
import { generateMarkdown } from "./generateMarkdown";

interface NotionBlock {
  type: string;
  heading_2?: { rich_text: { text: { content: string } }[] };
}

const pagesCreate = vi.fn(async (_args: unknown) => ({ id: "new-page-id" }));
const pagesUpdate = vi.fn(async (_args: { page_id: string }) => ({ id: "existing-page-id" }));
const blocksAppend = vi.fn(async (_args: { block_id: string; children: NotionBlock[] }) => ({}));

vi.mock("@notionhq/client", () => ({
  Client: vi.fn().mockImplementation(function MockClient() {
    return {
      pages: { create: pagesCreate, update: pagesUpdate },
      blocks: { children: { append: blocksAppend } },
    };
  }),
}));

process.env.NOTION_API_KEY = "test-api-key";
process.env.NOTION_DATABASE_ID = "test-database-id";

const { createOrUpdatePaperPage } = await import("./notion");

function headingTextsFromAppendCalls(): string[] {
  return blocksAppend.mock.calls.flatMap(([{ children }]) =>
    children
      .filter((block) => block.type === "heading_2")
      .map((block) => block.heading_2!.rich_text.map((t) => t.text.content).join(""))
  );
}

describe("createOrUpdatePaperPage", () => {
  beforeEach(() => {
    pagesCreate.mockClear();
    pagesUpdate.mockClear();
    blocksAppend.mockClear();
  });

  it("creates a brand-new page when no existingPageId is given, never calling update", async () => {
    const data = createDefaultFormData();
    data.title.finalTitle = "Meu paper";
    const markdown = generateMarkdown(data);

    const result = await createOrUpdatePaperPage(data, markdown);

    expect(pagesCreate).toHaveBeenCalledTimes(1);
    expect(pagesUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "new-page-id", isUpdate: false });
    expect(headingTextsFromAppendCalls().some((h) => h.startsWith("Versão inicial"))).toBe(true);
  });

  it("updates the existing page and appends a new revision instead of creating a duplicate", async () => {
    const data = createDefaultFormData();
    data.title.finalTitle = "Meu paper revisado";
    const markdown = generateMarkdown(data);

    const result = await createOrUpdatePaperPage(data, markdown, "existing-page-id");

    expect(pagesUpdate).toHaveBeenCalledTimes(1);
    expect(pagesUpdate.mock.calls[0][0]).toMatchObject({ page_id: "existing-page-id" });
    expect(pagesCreate).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "existing-page-id", isUpdate: true });
    expect(headingTextsFromAppendCalls().some((h) => h.startsWith("Revisão"))).toBe(true);
  });
});
