export function handlePlainTextPaste(
  e: React.ClipboardEvent<HTMLTextAreaElement>,
  value: string,
  onValueChange: (newValue: string) => void
): string | null {
  const text = e.clipboardData.getData('text/plain')
  if (!text) return null
  
  e.preventDefault()
  
  const target = e.target as HTMLTextAreaElement
  const start = target.selectionStart || 0
  const end = target.selectionEnd || 0
  const newValue = value.substring(0, start) + text + value.substring(end)
  
  onValueChange(newValue)
  
  setTimeout(() => {
    target.selectionStart = target.selectionEnd = start + text.length
  }, 0)
  
  return newValue
}

export function handlePlainTextPasteForContentEditable(
  e: React.ClipboardEvent<HTMLDivElement>
): void {
  const text = e.clipboardData.getData("text/plain")
  if (!text) return
  
  e.preventDefault()
  
  // Insert plain text at cursor in contenteditable
  document.execCommand("insertText", false, text)
}

