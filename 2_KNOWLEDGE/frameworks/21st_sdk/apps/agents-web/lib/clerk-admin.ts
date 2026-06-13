import { clerkClient } from "@clerk/nextjs/server"

// Используем глобальный клиент Clerk
const clerkAdmin = clerkClient

export interface CreateUserOptions {
  email: string
  firstName?: string
  lastName?: string
}

export async function createUserInClerk(options: CreateUserOptions) {
  const { email, firstName, lastName } = options

  try {
    console.log(`Creating user in Clerk via REST API for email: ${email}`)

    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY environment variable is not set")
    }

    // Шаг 1: Создаем пользователя с временным паролем (обязательно для вашего instance)
    console.log("Step 1: Creating user with temporary password...")
    const tempPassword = `TempPass123!${Date.now().toString().slice(-6)}` // Уникальный временный пароль

    const createUserResponse = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: tempPassword,
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
      }),
    })

    console.log(`Create user response status: ${createUserResponse.status}`)

    if (!createUserResponse.ok) {
      const errorText = await createUserResponse.text()
      console.error("Clerk API error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      const errorMessage =
        errorData.errors?.[0]?.message ||
        errorData.message ||
        `HTTP ${createUserResponse.status}: ${createUserResponse.statusText}`

      throw new Error(`Failed to create user in Clerk: ${errorMessage}`)
    }

    const userData = await createUserResponse.json()
    console.log(`User created with temp password, ID: ${userData.id}`)

    // Шаг 2: Добавляем email address через правильный endpoint
    console.log("Step 2: Adding email address...")
    const addEmailResponse = await fetch(
      `https://api.clerk.com/v1/email_addresses`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.id,
          email_address: email,
          verified: true,
          primary: true,
        }),
      },
    )

    console.log(`Add email response status: ${addEmailResponse.status}`)

    if (!addEmailResponse.ok) {
      const errorText = await addEmailResponse.text()
      console.error("Email add error:", errorText)
      console.log(
        "Warning: Could not add email, but user was created with temp password",
      )
    } else {
      console.log("Email added successfully as primary")
    }

    // Возвращаем финальные данные пользователя
    console.log(
      `User created successfully with ID: ${userData.id} - can now login via email/magic link`,
    )
    console.log(
      `Temporary password: ${tempPassword} (user can reset this via email)`,
    )

    return userData
  } catch (error: any) {
    console.error("Clerk API error:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY environment variable is not set")
    }

    const response = await fetch(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      console.error("Error getting user by email:", response.statusText)
      return null
    }

    const data = await response.json()
    return data.find((user: any) =>
      user.email_addresses.some((addr: any) => addr.email_address === email),
    )
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export { clerkAdmin }
