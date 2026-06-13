/** Base URL for internal server-to-server API calls (stays on 21st.dev) */
export function getInternalBaseUrl(): string {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://21st.dev"
}

/** Base URL for links shown in GitHub/Linear/Discord comments */
export function getExternalBaseUrl(): string {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://1code.dev"
}

/** Build a user-facing link to a specific chat or inbox chat */
export function getChatUrl(chatId: string, addToInbox?: boolean): string {
  const base = getExternalBaseUrl()
  return addToInbox
    ? `${base}/app/inbox?chat=${chatId}`
    : `${base}/app?chat=${chatId}`
}

/** Standard "Powered by" footer for external comments */
export const POWERED_BY_FOOTER = `_Powered by [1Code](https://1code.dev/async)_`
