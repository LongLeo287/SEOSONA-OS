import { useState, useEffect } from "react"

export function useTypingEffect(text: string, startDelay: number = 0) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    setDisplayedText("")

    const startTyping = setTimeout(() => {
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 30) // 30ms delay between each character

      return () => clearInterval(typingInterval)
    }, startDelay)

    return () => clearTimeout(startTyping)
  }, [text, startDelay])

  return { displayedText, isTyping }
}
