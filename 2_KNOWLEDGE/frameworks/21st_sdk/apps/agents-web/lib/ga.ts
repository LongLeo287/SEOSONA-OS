export async function getGaClientId(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined

  return new Promise((resolve) => {
    const w = window as any
    if (!w.gtag) {
      resolve(undefined)
      return
    }

    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      resolve(undefined)
    }, 2000) // 2 second timeout

    try {
      w.gtag("get", "G-X7C2K3V7GX", "client_id", (clientId: string) => {
        clearTimeout(timeout)
        resolve(clientId)
      })
    } catch (error) {
      clearTimeout(timeout)
      resolve(undefined)
    }
  })
}
