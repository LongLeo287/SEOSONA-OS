// Shared types for follows router and feed components

export type UserSelect = {
  id: string
  username: string | null
  display_username: string | null
  name: string | null
  display_name: string | null
  image_url: string | null
  display_image_url: string | null
}

export type ComponentSelect = {
  id: number
  name: string
  component_slug: string
  preview_url: string | null
  user?: UserSelect
}

export type FeedItemDemo = {
  id: number
  name: string | null
  demo_slug: string
  preview_url: string | null
  video_url: string | null
  created_at?: Date
  view_count?: number
  bookmarks_count?: number
  _count?: { demoBookmarks: number }
  component: ComponentSelect | null
  user: UserSelect
}

export type ForYouFeedItem = {
  id: string
  type: "trending" | "from_bookmarked_author" | "similar"
  timestamp: Date
  reason: string
  demo: FeedItemDemo
}

export type FollowingFeedItem = {
  id: string
  type: "demo" | "bookmark"
  timestamp: Date
  user: UserSelect
  reason: string
  demo: FeedItemDemo
}

export type FeedReasonType =
  | "trending"
  | "from_bookmarked_author"
  | "similar"
  | "demo"
  | "bookmark"
