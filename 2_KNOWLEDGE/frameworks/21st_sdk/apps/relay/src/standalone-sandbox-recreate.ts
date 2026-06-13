import { eq } from 'drizzle-orm';
import { db } from './db';
import { ResolvedSandboxConfig } from './deployment-metadata';
import { createProvisionedSandbox, destroySandbox } from './sandbox-factory';
import { SandboxHandle } from './sandbox-backends/types';
import { anSandboxes } from './schema';
import { isStandaloneWorkspaceVolumesEnabled } from './standalone-workspace-pvc';

type StandaloneSandboxRecord = {
  id: string;
  client_sandbox_id: string | null;
  sandbox_id: string | null;
  provider: string | null;
  meta: unknown;
};

export async function recreateStandaloneOpenSandbox(params: {
  sandboxRecord: StandaloneSandboxRecord;
  runtime: string;
  userId: string;
  teamId: string;
  bundleUrl?: string | null;
  mcpConfigUrl?: string | null;
  envVars?: Record<string, string> | null;
  sandboxConfig: ResolvedSandboxConfig;
}): Promise<{
  sandbox: StandaloneSandboxRecord;
  handle: SandboxHandle;
}> {
  const { sandboxRecord, runtime, userId, teamId, bundleUrl, mcpConfigUrl, envVars, sandboxConfig } = params;

  if (!isStandaloneWorkspaceVolumesEnabled(sandboxConfig.provider)) {
    throw new Error('Standalone sandbox recreate is only supported for standalone OpenSandbox sandboxes');
  }

  const clientSandboxId = sandboxRecord.client_sandbox_id;
  if (!clientSandboxId) {
    throw new Error('Standalone sandbox recreate requires client_sandbox_id');
  }

  const previousSandboxId = sandboxRecord.sandbox_id;
  const createdHandle = await createProvisionedSandbox({
    runtime,
    userId,
    sandboxConfig,
    bundleUrl,
    mcpConfigUrl,
    envVars,
    clientSandboxId,
    teamId,
  });

  try {
    const [updatedSandbox] = await db
      .update(anSandboxes)
      .set({
        sandbox_id: createdHandle.sandboxId,
        provider: createdHandle.provider,
        status: 'active',
        error: null,
        updated_at: new Date(),
      })
      .where(eq(anSandboxes.id, sandboxRecord.id))
      .returning({
        id: anSandboxes.id,
        client_sandbox_id: anSandboxes.client_sandbox_id,
        sandbox_id: anSandboxes.sandbox_id,
        provider: anSandboxes.provider,
        meta: anSandboxes.meta,
      });

    if (!updatedSandbox) {
      throw new Error(`Failed to update sandbox record ${sandboxRecord.id} during standalone recreate`);
    }

    if (previousSandboxId && previousSandboxId !== createdHandle.sandboxId) {
      destroySandbox('opensandbox', previousSandboxId).catch((error) => {
        console.warn('[STANDALONE_SANDBOX_RECREATE] Failed to destroy previous OpenSandbox sandbox:', error);
      });
    }

    return {
      sandbox: updatedSandbox,
      handle: createdHandle,
    };
  } catch (error) {
    await createdHandle.destroy().catch(() => {});
    await createdHandle.close().catch(() => {});
    throw error;
  }
}
