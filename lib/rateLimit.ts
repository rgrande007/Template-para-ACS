const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const requestLog = new Map<string, number[]>();

/**
 * Limitador em memória, por instância do servidor. Em ambientes serverless com múltiplas
 * instâncias (ou cold starts), o limite é "melhor esforço" e não é compartilhado entre elas —
 * suficiente para conter abuso acidental de uma turma, não uma defesa contra um atacante sério.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}
