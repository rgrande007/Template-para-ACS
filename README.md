# ACS Paper Builder

MVP de uma aplicação web que guia alunos de iniciação científica, mestrado e doutorado por um formulário contínuo (com navegação por seções) para planejar um artigo científico no formato **Article** da American Chemical Society (ACS). Enquanto o aluno responde, uma prévia ao vivo mostra o texto já formatado no padrão ACS. Ao final, a aplicação gera um esqueleto do paper em Markdown e permite salvar o resultado como uma página em um banco de dados do Notion.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- Rota de API interna (`/api/create-paper`) para integração server-side com a API do Notion
- `@notionhq/client` (SDK oficial do Notion)

## Funcionalidades

- Formulário contínuo, dividido em seções (Dados iniciais, Frase central, Title, Abstract, Introduction, Methods, Results, Conclusions, Supporting Information e Revisão)
- Navegação lateral por âncoras, com destaque automático da seção visível (scroll-spy) e opção de recolher para mostrar apenas ícones
- Cada seção do formulário pode ser recolhida/expandida individualmente (estado salvo no navegador)
- Divisor arrastável (mouse, toque ou teclado) entre o formulário e a prévia, para ajustar a largura de cada painel
- Prévia ao vivo à direita (ou em painel deslizante no celular), mostrando o paper já formatado no padrão ACS conforme o aluno digita
- Indicador de percentual preenchido no formulário
- Cada seção mostra o objetivo, a fórmula de escrita sugerida e os campos a preencher
- Aviso fixo sobre idioma (respostas podem ser em português, mas o texto final precisa estar em inglês) e sobre o Markdown gerado ser um rascunho, não uma versão final
- Contagem de caracteres/palavras nos campos de Title e Abstract, como referência dos limites usuais da ACS
- Cada fórmula de escrita tem dois exemplos preenchidos, de áreas diferentes da química (nanomateriais/têxteis e catálise heterogênea), para deixar claro que a fórmula é um padrão a adaptar, não um roteiro fixo
- Indicador visual (círculo vazio / parcial / com check) ao lado de cada seção na navegação lateral, mostrando o que já foi preenchido
- Tipografia pensada para leitura acadêmica prolongada: Crimson Pro nos títulos e Atkinson Hyperlegible no corpo do texto (fonte desenhada para legibilidade), carregadas via `next/font`
- Link "Pular para o conteúdo principal" para quem navega por teclado/leitor de tela
- Progresso salvo automaticamente no `localStorage` do navegador
- Botões "Baixar rascunho" e "Importar rascunho", para exportar/restaurar todas as respostas como um arquivo `.json` — um backup independente do navegador usado
- Botão para limpar todo o formulário
- Geração do esqueleto final do paper em Markdown (com estrutura para colagem/edição)
- Botão para copiar o Markdown para a área de transferência
- Botão "Salvar no Notion", com mensagem de sucesso ou erro. Cliques repetidos **não** criam páginas duplicadas: a partir do segundo salvamento, a mesma página do Notion é atualizada e a versão mais recente é anexada como uma nova revisão (com data/hora), preservando o histórico de evolução do rascunho
- Token do Notion nunca é exposto ao frontend (fica apenas no servidor)
- Rota `/api/create-paper` protegida por um código de submissão opcional (`NOTION_SUBMISSION_TOKEN`) e por um limite de requisições por IP, para reduzir o risco de spam quando a URL é compartilhada com uma turma inteira

## Estrutura do projeto

```
app/
  page.tsx                 # Página principal (renderiza o Wizard)
  layout.tsx               # Layout raiz
  error.tsx                # Tela de erro (App Router error boundary)
  globals.css              # Estilos globais (Tailwind)
  api/
    create-paper/
      route.ts             # Rota interna que cria a página no Notion
components/
  Wizard.tsx               # Orquestra o estado do formulário, ações e o layout contínuo
  SectionNav.tsx            # Navegação lateral por âncoras, colapsável, com scroll-spy
  SectionIcon.tsx            # Ícones usados na navegação lateral quando recolhida
  ResizeHandle.tsx           # Divisor arrastável (mouse/toque/teclado) entre formulário e prévia
  LivePreview.tsx            # Prévia ao vivo do paper formatado no padrão ACS
  CompletionBadge.tsx        # Indicador de percentual preenchido
  FormField.tsx             # Campo de formulário reutilizável (input/textarea/select/combo)
  MarkdownPreview.tsx       # Pré-visualização do Markdown bruto (seção de revisão)
  FormulaBox.tsx            # Destaque visual para as fórmulas de escrita
  StepCard.tsx              # Cartão recolhível com título + objetivo de cada seção
  steps/                    # Um componente por seção do formulário
lib/
  notion.ts                # Cliente do Notion e criação da página (uso exclusivo no servidor)
  generateMarkdown.ts      # Monta o Markdown final a partir das respostas
  formSchema.ts            # Metadados das seções e estado inicial do formulário
  progress.ts              # Cálculo do percentual de preenchimento
types/
  paper.ts                 # Tipos TypeScript dos dados do formulário
.env.example
```

## Pré-requisitos

- Node.js 18 ou superior
- Uma conta no Notion e permissão para criar integrações

## Instalação

```bash
npm install
```

## Configuração das variáveis de ambiente

1. Copie o arquivo de exemplo:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha as variáveis no `.env.local`:

   ```
   NOTION_API_KEY=seu_token_de_integracao
   NOTION_DATABASE_ID=id_do_seu_database
   NOTION_SUBMISSION_TOKEN=um_codigo_qualquer_para_a_turma
   ```

   Essas variáveis são lidas **apenas no servidor** (dentro de `lib/notion.ts` e da rota `app/api/create-paper/route.ts`). Nunca são enviadas ao navegador do usuário.

   `NOTION_SUBMISSION_TOKEN` é opcional, mas fortemente recomendado sempre que a URL da aplicação for compartilhada com uma turma: se definida, a rota `/api/create-paper` passa a exigir esse código (o aluno é solicitado a digitá-lo na primeira vez que clica em "Salvar no Notion"). Sem essa variável, qualquer pessoa com a URL pode chamar a rota livremente.

### Como criar a integração do Notion e obter o `NOTION_API_KEY`

1. Acesse https://www.notion.so/my-integrations
2. Clique em **New integration**, dê um nome (ex.: "ACS Paper Builder") e selecione o workspace
3. Copie o **Internal Integration Secret** gerado — esse é o valor de `NOTION_API_KEY`

### Como criar o database e obter o `NOTION_DATABASE_ID`

1. No Notion, crie uma nova página e adicione um **database** (tabela)
2. Configure as seguintes propriedades no database:

   | Propriedade                | Tipo         |
   |-----------------------------|--------------|
   | Title                       | Title        |
   | Aluno                       | Rich text    |
   | Revista alvo                | Rich text    |
   | Status                      | Select       |
   | Frase central               | Rich text    |
   | Data de criação             | Date         |
   | Introdução preenchida       | Checkbox     |
   | Resultados preenchidos      | Checkbox     |
   | Conclusão preenchida        | Checkbox     |

   > Para a propriedade **Status**, crie ao menos a opção `Rascunho` (é o valor usado pela aplicação ao criar uma nova página).

3. Compartilhe o database com a integração criada: abra o database, clique em **"..."** (menu) → **Connections** → **Connect to** → selecione a integração criada
4. Copie o ID do database a partir da URL da página. A URL tem o formato:

   ```
   https://www.notion.so/workspace/<DATABASE_ID>?v=<view_id>
   ```

   O `DATABASE_ID` é a sequência de 32 caracteres (com ou sem hífens) antes do `?v=`.

## Executando localmente

```bash
npm run dev
```

Acesse http://localhost:3000

## Build de produção

```bash
npm run build
npm run start
```

## Testes

```bash
npm test
```

Cobre a lógica pura de `lib/` (geração do Markdown, cálculo de progresso, limitador de requisições e o comportamento de criar-vs-atualizar página no Notion, com o cliente do Notion mockado). Não há testes de interface — a verificação da UI é manual/visual.

## Segurança

- `NOTION_API_KEY` e `NOTION_DATABASE_ID` são usados exclusivamente em código server-side (`lib/notion.ts`, executado pela rota `app/api/create-paper/route.ts`). Eles nunca são incluídos no bundle enviado ao navegador.
- O frontend só se comunica com o Notion indiretamente, enviando os dados do formulário via `POST /api/create-paper`.
- A rota valida um código de submissão (`NOTION_SUBMISSION_TOKEN`, ver seção de configuração acima) e aplica um limite de requisições por IP (`lib/rateLimit.ts`) antes de gravar no Notion. O limite de requisições é em memória por instância do servidor — é uma proteção de "melhor esforço" contra abuso de uma turma, não uma defesa contra um atacante dedicado.
- Os dados enviados a essa rota (incluindo resultados de pesquisa ainda não publicados) ficam armazenados no workspace do Notion configurado. Avalie quem tem acesso a esse workspace antes de distribuir a URL da aplicação — o token de submissão citado acima reduz gravações indevidas, mas não substitui o controle de acesso do próprio Notion.
- Não faça commit do arquivo `.env.local` (ele já está no `.gitignore`).
