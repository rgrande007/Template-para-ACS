import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePaperPage } from "@/lib/notion";
import { generateMarkdown } from "@/lib/generateMarkdown";
import { isRateLimited } from "@/lib/rateLimit";
import { PaperFormData } from "@/types/paper";

interface CreatePaperRequestBody {
  data: PaperFormData;
  notionPageId?: string;
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente." },
      { status: 429 }
    );
  }

  const requiredToken = process.env.NOTION_SUBMISSION_TOKEN;
  if (requiredToken && request.headers.get("x-submission-token") !== requiredToken) {
    return NextResponse.json(
      { success: false, error: "Código de submissão ausente ou inválido." },
      { status: 401 }
    );
  }

  let body: CreatePaperRequestBody;
  let data: PaperFormData;

  try {
    body = await request.json();
    data = body.data;
  } catch {
    return NextResponse.json(
      { success: false, error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const requiredSections: (keyof PaperFormData)[] = [
    "initial",
    "centralSentence",
    "title",
    "abstract",
    "introduction",
    "methods",
    "results",
    "conclusions",
    "supportingInfo",
  ];
  if (requiredSections.some((key) => !data?.[key]) || !Array.isArray(data?.results?.figures)) {
    return NextResponse.json(
      { success: false, error: "Dados do formulário incompletos ou em formato inesperado." },
      { status: 400 }
    );
  }

  if (!data.initial.studentName?.trim()) {
    return NextResponse.json(
      { success: false, error: "Nome do aluno é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const markdown = generateMarkdown(data);
    const page = await createOrUpdatePaperPage(data, markdown, body.notionPageId);
    return NextResponse.json({ success: true, pageId: page.id, isUpdate: page.isUpdate });
  } catch (error) {
    console.error("Erro ao criar página no Notion:", error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao salvar no Notion.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
