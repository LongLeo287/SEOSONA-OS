export const copyToClipboard = async (
  content: string | Promise<string>,
): Promise<string> => {
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/plain": content,
    }),
  ])
  return content
}
