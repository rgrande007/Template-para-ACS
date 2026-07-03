"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-2xl font-bold text-ink">Algo deu errado</h1>
      <p className="text-sm text-muted">
        Ocorreu um erro inesperado ao carregar o ACS Paper Builder. Suas respostas continuam salvas no navegador.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
