const INTERNAL_GITHUB_TOKEN_PATH = '/api/agents/github/installation-token';

export async function getGitHubInstallationAccessToken(params: {
  teamId: string;
  userId: string;
  repository: string;
}): Promise<{ token: string; installationId: string }> {
  const baseUrl = process.env.BILLING_SETUP_BASE_URL?.trim();
  const internalToken = process.env.INTERNAL_API_SECRET?.trim();

  if (!baseUrl || !internalToken) {
    throw new Error(
      'BILLING_SETUP_BASE_URL and INTERNAL_API_SECRET are required for GitHub token minting',
    );
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}${INTERNAL_GITHUB_TOKEN_PATH}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': internalToken,
      },
      body: JSON.stringify({
        teamId: params.teamId,
        userId: params.userId,
        repository: params.repository,
      }),
    },
  );

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => ({ message: 'Failed to mint GitHub installation token' }));
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : `Failed to mint GitHub installation token: ${response.status}`;
    throw new Error(message);
  }

  const payload = (await response.json()) as {
    token: string;
    installationId: string;
  };

  if (!payload?.token || !payload?.installationId) {
    throw new Error('Invalid GitHub token response from internal API');
  }

  return payload;
}
