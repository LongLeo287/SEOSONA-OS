import type { Sandbox } from '@e2b/code-interpreter';
import { getGitHubInstallationAccessToken } from './github-auth';

const SANDBOX_ROOT_USER = 'root';

function buildAuthenticatedGitHubUrl(repository: string, token: string): string {
  return `https://x-access-token:${encodeURIComponent(token)}@github.com/${repository}.git`;
}

export async function cloneGitHubRepositoryIntoSandbox(params: {
  sandbox: Sandbox;
  teamId: string;
  userId: string;
  repository: string;
  path?: string;
  depth?: number;
  branch?: string;
}): Promise<{ path: string; branch: string; baseCommitSha: string }> {
  const { execFileSync } = await import('node:child_process');
  const { mkdtempSync, readFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');

  const { token } = await getGitHubInstallationAccessToken({
    teamId: params.teamId,
    userId: params.userId,
    repository: params.repository,
  });

  const tmpDir = mkdtempSync(join(tmpdir(), 'agent-clone-'));
  const localRepoDir = join(tmpDir, 'repo');
  const sandboxPath = params.path || '/home/user/repo';
  const originUrl = `https://github.com/${params.repository}.git`;

  try {
    const cloneArgs = ['clone'];
    if (params.depth) cloneArgs.push('--depth', String(params.depth));
    if (params.branch) cloneArgs.push('--branch', params.branch);
    cloneArgs.push(buildAuthenticatedGitHubUrl(params.repository, token), localRepoDir);

    execFileSync('git', cloneArgs, { timeout: 120_000 });
    execFileSync('git', ['remote', 'set-url', 'origin', originUrl], { cwd: localRepoDir });

    const baseCommitSha = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: localRepoDir,
      encoding: 'utf-8',
    }).trim();
    const baseBranch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: localRepoDir,
      encoding: 'utf-8',
    }).trim() || params.branch || 'main';

    const tarFile = join(tmpDir, 'repo.tar.gz');
    execFileSync('tar', ['-czf', tarFile, '-C', tmpDir, 'repo'], { timeout: 60_000 });

    const tarBlob = new Blob([readFileSync(tarFile)], { type: 'application/gzip' });
    const parentDir = sandboxPath.substring(0, sandboxPath.lastIndexOf('/')) || '/home/user';

    await params.sandbox.commands.run(`mkdir -p ${JSON.stringify(parentDir)}`);
    await params.sandbox.files.write(`${parentDir}/repo.tar.gz`, tarBlob, {
      user: SANDBOX_ROOT_USER,
    });

    const extractResult = await params.sandbox.commands.run(
      `cd ${JSON.stringify(parentDir)} && tar -xzf repo.tar.gz && rm -rf ${JSON.stringify(sandboxPath)} && mv repo ${JSON.stringify(sandboxPath)} && rm repo.tar.gz`,
      { timeoutMs: 60_000 },
    );

    if (extractResult.exitCode !== 0) {
      throw new Error(extractResult.stderr || 'Failed to extract repo in sandbox');
    }

    return {
      path: sandboxPath,
      branch: baseBranch,
      baseCommitSha,
    };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}
