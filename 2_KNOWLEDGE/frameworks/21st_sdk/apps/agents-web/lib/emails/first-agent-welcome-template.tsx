interface FirstAgentWelcomeEmailProps {
  userName?: string
}

export function getFirstAgentWelcomeText({
  userName,
}: FirstAgentWelcomeEmailProps): string {
  const greeting = userName ? `hey ${userName},` : "hey,"

  return `${greeting}

thanks for deploying your first agent!

let's hop on a call — we'd love to hear about your use case and how we can make the product better for you.

we're happy to give you $200 in platform tokens for the call.

here's the link to book: https://cal.com/team/21st/an

serafim
21st.dev`
}
