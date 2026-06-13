import { and, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { anRuns, anSandboxes, anThreads } from './schema';

export type BudgetScope =
  | { type: 'agent'; agentId: string }
  | { type: 'sandbox'; agentId: string; clientSandboxId: string }
  | { type: 'thread'; threadId: string };

const totalSpend = sql<number>`COALESCE(SUM(${anRuns.total_cost_usd}), 0)::double precision`;

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export async function getCompletedRunSpendUsd(scope: BudgetScope): Promise<number> {
  if (scope.type === 'agent') {
    const [row] = await db
      .select({ total: totalSpend })
      .from(anRuns)
      .where(and(
        eq(anRuns.agent_id, scope.agentId),
        eq(anRuns.status, 'completed'),
      ));

    return toNumber(row?.total);
  }

  if (scope.type === 'thread') {
    const [row] = await db
      .select({ total: totalSpend })
      .from(anRuns)
      .where(and(
        eq(anRuns.thread_id, scope.threadId),
        eq(anRuns.status, 'completed'),
      ));

    return toNumber(row?.total);
  }

  const [row] = await db
    .select({ total: totalSpend })
    .from(anRuns)
    .innerJoin(anThreads, eq(anRuns.thread_id, anThreads.id))
    .innerJoin(anSandboxes, eq(anThreads.sandbox_id, anSandboxes.id))
    .where(and(
      eq(anSandboxes.agent_id, scope.agentId),
      eq(anSandboxes.client_sandbox_id, scope.clientSandboxId),
      eq(anRuns.status, 'completed'),
    ));

  return toNumber(row?.total);
}

export function isBudgetExceeded(params: {
  spentUsd: number;
  limitUsd: number | null | undefined;
}) {
  return typeof params.limitUsd === 'number'
    && Number.isFinite(params.limitUsd)
    && params.limitUsd > 0
    && params.spentUsd >= params.limitUsd;
}
