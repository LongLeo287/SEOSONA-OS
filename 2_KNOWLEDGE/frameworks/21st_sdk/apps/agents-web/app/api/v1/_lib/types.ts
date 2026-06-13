export type TaskStatus = "pending" | "in_progress" | "completed" | "failed"

export interface TaskResponse {
  id: string
  chatId: string | null
  teamId: string
  status: TaskStatus
  title: string
  repository: string
  branch: string | null
  prUrl: string | null
  viewUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  hasMore: boolean
}
