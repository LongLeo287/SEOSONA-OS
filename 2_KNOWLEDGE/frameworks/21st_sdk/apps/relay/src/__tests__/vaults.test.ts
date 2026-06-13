import express from "express"
import { beforeEach, describe, expect, it, vi } from "vitest"

type DbResult = unknown[]

const dbMockState = vi.hoisted(() => ({
  selectResults: [] as DbResult[],
  insertResults: [] as DbResult[],
  updateResults: [] as DbResult[],
  updateSets: [] as unknown[],
  deleteCalls: 0,
}))

function createSelectBuilder(result: DbResult) {
  const builder = {
    from: vi.fn(() => builder),
    innerJoin: vi.fn(() => builder),
    where: vi.fn(() => builder),
    orderBy: vi.fn(async () => result),
    limit: vi.fn(async () => result),
    then: vi.fn((resolve: (value: unknown) => unknown) => {
      resolve(result)
      return Promise.resolve(result)
    }),
  }
  return builder
}

function createUpdateBuilder() {
  const builder = {
    set: vi.fn((value: unknown) => {
      dbMockState.updateSets.push(value)
      return builder
    }),
    where: vi.fn(() => builder),
    returning: vi.fn(async () => dbMockState.updateResults.shift() ?? []),
    then: vi.fn((resolve: (value: unknown) => unknown) => {
      resolve([])
      return Promise.resolve([])
    }),
    catch: vi.fn(() => Promise.resolve([])),
  }
  return builder
}

vi.mock("../db", () => ({
  db: {
    select: vi.fn(() => createSelectBuilder(dbMockState.selectResults.shift() ?? [])),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(async () => dbMockState.insertResults.shift() ?? []),
      })),
    })),
    update: vi.fn(() => createUpdateBuilder()),
    delete: vi.fn(() => ({
      where: vi.fn(async () => {
        dbMockState.deleteCalls += 1
      }),
    })),
    transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => {
      const { db } = await import("../db")
      return callback(db)
    }),
  },
}))

vi.mock("../crypto", () => ({
  decrypt: vi.fn((value: string) => value.replace(/^encrypted:/, "")),
  encrypt: vi.fn((value: string) => `encrypted:${value}`),
}))

const { initVaultsRouter } = await import("../vaults")

const now = new Date("2026-04-27T00:00:00.000Z")

function vaultRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "vault-a",
    team_id: "team-a",
    name: "Main vault",
    description: null,
    metadata: {},
    is_default: false,
    status: "active",
    created_at: now,
    updated_at: now,
    archived_at: null,
    ...overrides,
  }
}

function credentialRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "credential-a",
    vault_id: "vault-a",
    name: "Linear",
    server_url: "https://mcp.linear.app/mcp",
    server_url_normalized: "https://mcp.linear.app/mcp",
    host_pattern: "mcp.linear.app",
    inject: { kind: "header", header: "Authorization", prefix: "Bearer " },
    auth_type: "bearer",
    encrypted_auth: 'encrypted:{"type":"bearer","token":"secret"}',
    metadata: {},
    status: "active",
    last_error: null,
    last_resolved_at: null,
    created_at: now,
    updated_at: now,
    archived_at: null,
    ...overrides,
  }
}

function createApp() {
  const app = express()
  app.use(express.json())
  app.use((req, _res, next) => {
    Object.assign(req, {
      teamId: "team-a",
      apiKeySource: "an",
      apiKey: {
        id: "key-a",
        user_id: "user-a",
        requests_count: 0,
        requests_limit: 100,
      },
    })
    next()
  })
  app.use(initVaultsRouter())
  return app
}

async function requestJson(
  app: express.Express,
  method: string,
  path: string,
  body?: unknown,
) {
  const server = app.listen(0, "127.0.0.1")
  await new Promise<void>((resolve) => server.once("listening", resolve))
  const address = server.address()
  if (!address || typeof address !== "object") {
    throw new Error("Test server did not expose a port")
  }
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await response.text()
    return {
      status: response.status,
      body: text ? JSON.parse(text) as unknown : null,
    }
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}

beforeEach(() => {
  dbMockState.selectResults = []
  dbMockState.insertResults = []
  dbMockState.updateResults = []
  dbMockState.updateSets = []
  dbMockState.deleteCalls = 0
})

describe("relay vault routes", () => {
  it("lists vaults with redacted credentials", async () => {
    dbMockState.selectResults.push([vaultRecord()], [credentialRecord()])

    const response = await requestJson(createApp(), "GET", "/")

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      vaults: [
        {
          id: "vault-a",
          teamId: "team-a",
          credentials: [
            {
              id: "credential-a",
              auth: { type: "bearer", hasToken: true },
            },
          ],
        },
      ],
    })
  })

  it("creates and updates vaults", async () => {
    dbMockState.insertResults.push([vaultRecord({ name: "Created vault" })])
    let response = await requestJson(createApp(), "POST", "/", {
      name: "  Created vault  ",
    })
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ vault: { name: "Created vault" } })

    dbMockState.selectResults.push([{ id: "vault-a" }], [])
    dbMockState.updateResults.push([vaultRecord({ name: "Updated vault" })])
    response = await requestJson(createApp(), "PATCH", "/vault-a", {
      name: "Updated vault",
    })
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ vault: { name: "Updated vault" } })
  })

  it("rejects foreign-team vault updates", async () => {
    dbMockState.selectResults.push([])

    const response = await requestJson(createApp(), "PATCH", "/foreign-vault", {
      name: "Nope",
    })

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({ error: "not_found" })
  })

  it("archives vaults", async () => {
    dbMockState.selectResults.push([{ id: "vault-a" }])

    const response = await requestJson(createApp(), "DELETE", "/vault-a")

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true })
    expect(dbMockState.updateSets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "archived", encrypted_auth: null }),
      ]),
    )
  })

  it("hard deletes archived or empty vaults", async () => {
    dbMockState.selectResults.push(
      [vaultRecord({ status: "archived", archived_at: now })],
      [{ count: 0 }],
    )

    const response = await requestJson(createApp(), "DELETE", "/vault-a?force=true")

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true })
    expect(dbMockState.deleteCalls).toBe(1)
  })
})
