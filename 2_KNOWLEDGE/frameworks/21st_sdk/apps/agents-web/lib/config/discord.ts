/**
 * Discord invite links configuration
 *
 * We have 3 Discord servers:
 * 1. 21st.dev public Discord - for general community
 * 2. 1Code open source Discord - for open source users
 * 3. 1Code paid Discord - for paying subscribers (private support)
 */

// 21st.dev public Discord (general community)
export const DISCORD_21ST_PUBLIC =
  process.env.NEXT_PUBLIC_DISCORD_21ST_URL || "https://discord.gg/Qx4rFunHfm"

// 1Code open source Discord
export const DISCORD_1CODE_OPENSOURCE =
  process.env.NEXT_PUBLIC_DISCORD_1CODE_OPENSOURCE_URL ||
  "https://discord.gg/8ektTZGnj4"

// 1Code paid subscribers Discord (private support)
export const DISCORD_1CODE_PAID =
  process.env.NEXT_PUBLIC_DISCORD_1CODE_PAID_URL ||
  "https://discord.gg/RTHdbZ9Kyb"
