import { useCallback, useEffect, useState } from "react"

type NotificationPermission = "granted" | "denied" | "default"

interface BrowserNotificationOptions {
  title: string
  body?: string
  icon?: string
  tag?: string
  onClick?: () => void
}

export function useBrowserNotification() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Notification API is supported
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn("Browser notifications are not supported")
      return "denied" as NotificationPermission
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return "denied" as NotificationPermission
    }
  }, [isSupported])

  const sendNotification = useCallback(
    ({ title, body, icon, tag, onClick }: BrowserNotificationOptions) => {
      if (!isSupported) {
        console.warn("Browser notifications are not supported")
        return null
      }

      if (permission !== "granted") {
        console.warn("Notification permission not granted")
        return null
      }

      // Don't show notification if document is visible/focused
      if (document.visibilityState === "visible") {
        return null
      }

      try {
        const notification = new Notification(title, {
          body,
          icon: icon || "/favicon.ico",
          tag, // Prevents duplicate notifications with same tag
        })

        if (onClick) {
          notification.onclick = () => {
            window.focus()
            onClick()
            notification.close()
          }
        }

        return notification
      } catch (error) {
        console.error("Error sending notification:", error)
        return null
      }
    },
    [isSupported, permission],
  )

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
  }
}

