export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_chats: {
        Row: {
          archived_at: string | null
          created_at: string
          credit_source: string | null
          deleted_at: string | null
          id: string
          meta: Json | null
          name: string
          sandbox_id: string | null
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          credit_source?: string | null
          deleted_at?: string | null
          id?: string
          meta?: Json | null
          name: string
          sandbox_id?: string | null
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          credit_source?: string | null
          deleted_at?: string | null
          id?: string
          meta?: Json | null
          name?: string
          sandbox_id?: string | null
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_chats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "agent_chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_invite_acceptances: {
        Row: {
          accepted_at: string
          id: string
          invite_code: string
          invited_user_id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          accepted_at?: string
          id?: string
          invite_code: string
          invited_user_id: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          accepted_at?: string
          id?: string
          invite_code?: string
          invited_user_id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_agent_invite_acceptances_invite_code"
            columns: ["invite_code"]
            isOneToOne: false
            referencedRelation: "agent_invites"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "fk_agent_invite_acceptances_invited_user"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_agent_invite_acceptances_invited_user"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_invites: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          inviter_user_id: string
          is_active: boolean
          last_reset_at: string
          max_uses: number
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          inviter_user_id: string
          is_active?: boolean
          last_reset_at?: string
          max_uses?: number
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          inviter_user_id?: string
          is_active?: boolean
          last_reset_at?: string
          max_uses?: number
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_agent_invites_inviter_user"
            columns: ["inviter_user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_agent_invites_inviter_user"
            columns: ["inviter_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_sub_chats: {
        Row: {
          chat_id: string
          created_at: string
          deleted_at: string | null
          id: string
          messages: Json | null
          mode: string
          name: string
          stream_id: string | null
          updated_at: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          messages?: Json | null
          mode?: string
          name: string
          stream_id?: string | null
          updated_at?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          messages?: Json | null
          mode?: string
          name?: string
          stream_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_sub_chats_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "agent_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      agents_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      announcement_campaigns: {
        Row: {
          banner_image_url: string | null
          banner_image_url_dark: string | null
          created_at: string
          cta_url: string | null
          description: string | null
          ends_at: string | null
          exp_id: string
          id: string
          is_active: boolean
          name: string
          priority: number
          starts_at: string | null
          target_pages: string[]
          target_plans: string[]
          target_roles: string[]
          updated_at: string
        }
        Insert: {
          banner_image_url?: string | null
          banner_image_url_dark?: string | null
          created_at?: string
          cta_url?: string | null
          description?: string | null
          ends_at?: string | null
          exp_id?: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          starts_at?: string | null
          target_pages?: string[]
          target_plans?: string[]
          target_roles?: string[]
          updated_at?: string
        }
        Update: {
          banner_image_url?: string | null
          banner_image_url_dark?: string | null
          created_at?: string
          cta_url?: string | null
          description?: string | null
          ends_at?: string | null
          exp_id?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          starts_at?: string | null
          target_pages?: string[]
          target_plans?: string[]
          target_roles?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      announcement_events: {
        Row: {
          campaign_id: string
          created_at: string
          event_type: Database["public"]["Enums"]["announcement_event_type"]
          id: string
          metadata: Json | null
          page_source: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          event_type: Database["public"]["Enums"]["announcement_event_type"]
          id?: string
          metadata?: Json | null
          page_source?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          event_type?: Database["public"]["Enums"]["announcement_event_type"]
          id?: string
          metadata?: Json | null
          page_source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "announcement_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_messages: {
        Row: {
          campaign_id: string
          created_at: string
          description: string
          icon: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          description: string
          icon: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "announcement_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key: string | null
          key_hash: string | null
          key_prefix: string | null
          last_used_at: string | null
          plan: Database["public"]["Enums"]["api_plan"] | null
          project_url: string | null
          requests_count: number | null
          requests_limit: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string | null
          key_hash?: string | null
          key_prefix?: string | null
          last_used_at?: string | null
          plan?: Database["public"]["Enums"]["api_plan"] | null
          project_url?: string | null
          requests_count?: number | null
          requests_limit?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string | null
          key_hash?: string | null
          key_prefix?: string | null
          last_used_at?: string | null
          plan?: Database["public"]["Enums"]["api_plan"] | null
          project_url?: string | null
          requests_count?: number | null
          requests_limit?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      author_payouts: {
        Row: {
          author_id: string
          comment: string | null
          created_at: string | null
          id: number
          paypal_email: string
          period_end: string
          period_start: string
          processed_at: string | null
          status: string
          total_amount: number
          total_usage: number
          transaction_id: string | null
        }
        Insert: {
          author_id: string
          comment?: string | null
          created_at?: string | null
          id?: number
          paypal_email: string
          period_end: string
          period_start: string
          processed_at?: string | null
          status?: string
          total_amount: number
          total_usage: number
          transaction_id?: string | null
        }
        Update: {
          author_id?: string
          comment?: string | null
          created_at?: string | null
          id?: number
          paypal_email?: string
          period_end?: string
          period_start?: string
          processed_at?: string | null
          status?: string
          total_amount?: number
          total_usage?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_code_embeddings: {
        Row: {
          created_at: string | null
          embedding: string | null
          id: string | null
          item_id: number | null
          item_type: string | null
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          embedding?: string | null
          id?: string | null
          item_id?: number | null
          item_type?: string | null
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          embedding?: string | null
          id?: string | null
          item_id?: number | null
          item_type?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      backup_usage_embeddings: {
        Row: {
          created_at: string | null
          embedding: string | null
          id: string | null
          item_id: number | null
          item_type: string | null
          metadata: Json | null
          usage_description: string | null
        }
        Insert: {
          created_at?: string | null
          embedding?: string | null
          id?: string | null
          item_id?: number | null
          item_type?: string | null
          metadata?: Json | null
          usage_description?: string | null
        }
        Update: {
          created_at?: string | null
          embedding?: string | null
          id?: string | null
          item_id?: number | null
          item_type?: string | null
          metadata?: Json | null
          usage_description?: string | null
        }
        Relationships: []
      }
      bundle_items: {
        Row: {
          bundle_id: number
          component_id: number
          created_at: string
          id: number
        }
        Insert: {
          bundle_id: number
          component_id: number
          created_at?: string
          id?: number
        }
        Update: {
          bundle_id?: number
          component_id?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "bundle_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      bundle_plans: {
        Row: {
          bundle_id: number
          created_at: string
          description: string
          features: string[]
          id: number
          price: number
          type: Database["public"]["Enums"]["bundle_plan_type"]
        }
        Insert: {
          bundle_id: number
          created_at?: string
          description: string
          features?: string[]
          id?: number
          price: number
          type: Database["public"]["Enums"]["bundle_plan_type"]
        }
        Update: {
          bundle_id?: number
          created_at?: string
          description?: string
          features?: string[]
          id?: number
          price?: number
          type?: Database["public"]["Enums"]["bundle_plan_type"]
        }
        Relationships: [
          {
            foreignKeyName: "bundle_plans_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_purchases: {
        Row: {
          bundle_id: number
          created_at: string
          fee: number
          id: string
          paid_to_user: boolean
          plan_id: number
          price: number
          status: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Insert: {
          bundle_id: number
          created_at?: string
          fee: number
          id: string
          paid_to_user?: boolean
          plan_id: number
          price: number
          status: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Update: {
          bundle_id?: number
          created_at?: string
          fee?: number
          id?: string
          paid_to_user?: boolean
          plan_id?: number
          price?: number
          status?: Database["public"]["Enums"]["payment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_purchases_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_purchases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "bundle_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bundle_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          created_at: string
          id: number
          is_public: boolean
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_public?: boolean
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_public?: boolean
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bundles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_access: {
        Row: {
          created_at: string
          email: string
          granted_by: string | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvas_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "canvas_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "canvas_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_onboarding_submissions: {
        Row: {
          booking_metadata: Json | null
          created_at: string
          email: string
          github_repository: string | null
          github_username: string | null
          id: string
          onboarding_type: string | null
          product_link: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          booking_metadata?: Json | null
          created_at?: string
          email: string
          github_repository?: string | null
          github_username?: string | null
          id?: string
          onboarding_type?: string | null
          product_link?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          booking_metadata?: Json | null
          created_at?: string
          email?: string
          github_repository?: string | null
          github_username?: string | null
          id?: string
          onboarding_type?: string | null
          product_link?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      code_chunks: {
        Row: {
          chunk_text: string
          code_type: string
          complexity_score: number | null
          component_id: number | null
          component_name: string | null
          contains_api: Json | null
          created_at: string | null
          demo_id: number | null
          embedding: unknown
          end_line: number
          file_path: string
          has_jsx: boolean | null
          id: string
          imports: Json | null
          is_simple_wrapper: boolean
          language: string | null
          start_line: number
          symbols: Json | null
          tags: Json | null
          updated_at: string | null
          uses_hooks: boolean | null
        }
        Insert: {
          chunk_text: string
          code_type: string
          complexity_score?: number | null
          component_id?: number | null
          component_name?: string | null
          contains_api?: Json | null
          created_at?: string | null
          demo_id?: number | null
          embedding?: unknown
          end_line: number
          file_path: string
          has_jsx?: boolean | null
          id?: string
          imports?: Json | null
          is_simple_wrapper?: boolean
          language?: string | null
          start_line: number
          symbols?: Json | null
          tags?: Json | null
          updated_at?: string | null
          uses_hooks?: boolean | null
        }
        Update: {
          chunk_text?: string
          code_type?: string
          complexity_score?: number | null
          component_id?: number | null
          component_name?: string | null
          contains_api?: Json | null
          created_at?: string | null
          demo_id?: number | null
          embedding?: unknown
          end_line?: number
          file_path?: string
          has_jsx?: boolean | null
          id?: string
          imports?: Json | null
          is_simple_wrapper?: boolean
          language?: string | null
          start_line?: number
          symbols?: Json | null
          tags?: Json | null
          updated_at?: string | null
          uses_hooks?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "code_chunks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "code_chunks_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_chunks_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
        ]
      }
      code_embeddings: {
        Row: {
          created_at: string | null
          embedding: string
          id: string
          item_id: number
          item_type: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          embedding: string
          id?: string
          item_id: number
          item_type: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          embedding?: string
          id?: string
          item_id?: number
          item_type?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      component_analytics: {
        Row: {
          activity_type: string | null
          anon_id: string | null
          component_id: number
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          activity_type?: string | null
          anon_id?: string | null
          component_id: number
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          activity_type?: string | null
          anon_id?: string | null
          component_id?: number
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "component_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      component_dependencies_closure: {
        Row: {
          component_id: number
          dependency_component_id: number
          depth: number
          is_demo_dependency: boolean
        }
        Insert: {
          component_id: number
          dependency_component_id: number
          depth: number
          is_demo_dependency?: boolean
        }
        Update: {
          component_id?: number
          dependency_component_id?: number
          depth?: number
          is_demo_dependency?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      component_hunt_rounds: {
        Row: {
          created_at: string | null
          end_at: string
          id: number
          seasonal_tag_id: number | null
          start_at: string
          week_number: number
        }
        Insert: {
          created_at?: string | null
          end_at: string
          id?: never
          seasonal_tag_id?: number | null
          start_at: string
          week_number: number
        }
        Update: {
          created_at?: string | null
          end_at?: string
          id?: never
          seasonal_tag_id?: number | null
          start_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "component_hunt_rounds_seasonal_tag_id_fkey"
            columns: ["seasonal_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      component_likes: {
        Row: {
          component_id: number
          liked_at: string | null
          user_id: string
        }
        Insert: {
          component_id: number
          liked_at?: string | null
          user_id: string
        }
        Update: {
          component_id?: number
          liked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_likes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "component_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      component_tags: {
        Row: {
          component_id: number
          tag_id: number
        }
        Insert: {
          component_id?: number
          tag_id: number
        }
        Update: {
          component_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_tags_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      components: {
        Row: {
          code: string
          compiled_css: string | null
          component_names: Json
          component_slug: string
          created_at: string
          demo_code: string | null
          demo_dependencies: Json | null
          demo_direct_registry_dependencies: Json
          dependencies: Json | null
          description: string | null
          direct_registry_dependencies: Json
          downloads_count: number
          fts: unknown
          global_css_extension: string | null
          hunter_username: string | null
          id: number
          index_css_url: string | null
          is_public: boolean
          license: string
          likes_count: number
          name: string
          payment_url: string | null
          preview_url: string
          pro_preview_image_url: string | null
          registry: string
          registry_url: string | null
          sandbox_id: string | null
          tailwind_config_extension: string | null
          updated_at: string
          user_id: string
          video_url: string | null
          website_url: string | null
        }
        Insert: {
          code?: string
          compiled_css?: string | null
          component_names: Json
          component_slug: string
          created_at?: string
          demo_code?: string | null
          demo_dependencies?: Json | null
          demo_direct_registry_dependencies?: Json
          dependencies?: Json | null
          description?: string | null
          direct_registry_dependencies?: Json
          downloads_count?: number
          fts?: unknown
          global_css_extension?: string | null
          hunter_username?: string | null
          id?: number
          index_css_url?: string | null
          is_public?: boolean
          license?: string
          likes_count?: number
          name: string
          payment_url?: string | null
          preview_url: string
          pro_preview_image_url?: string | null
          registry?: string
          registry_url?: string | null
          sandbox_id?: string | null
          tailwind_config_extension?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          website_url?: string | null
        }
        Update: {
          code?: string
          compiled_css?: string | null
          component_names?: Json
          component_slug?: string
          created_at?: string
          demo_code?: string | null
          demo_dependencies?: Json | null
          demo_direct_registry_dependencies?: Json
          dependencies?: Json | null
          description?: string | null
          direct_registry_dependencies?: Json
          downloads_count?: number
          fts?: unknown
          global_css_extension?: string | null
          hunter_username?: string | null
          id?: number
          index_css_url?: string | null
          is_public?: boolean
          license?: string
          likes_count?: number
          name?: string
          payment_url?: string | null
          preview_url?: string
          pro_preview_image_url?: string | null
          registry?: string
          registry_url?: string | null
          sandbox_id?: string | null
          tailwind_config_extension?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["dependency_author_username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["source_author_username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["dependency_author_username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["source_author_username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["dependency_author_username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["source_author_username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "components_hunter_username_fkey"
            columns: ["hunter_username"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "components_sandbox_id_fkey"
            columns: ["sandbox_id"]
            isOneToOne: false
            referencedRelation: "sandboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      components_purchases: {
        Row: {
          component_id: number
          created_at: string | null
          id: string
          price_paid: number
          user_id: string
        }
        Insert: {
          component_id: number
          created_at?: string | null
          id?: string
          price_paid: number
          user_id: string
        }
        Update: {
          component_id?: number
          created_at?: string | null
          id?: string
          price_paid?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "components_purchases_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "components_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "components_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      components_to_collections: {
        Row: {
          collection_id: string
          component_id: number
          created_at: string
        }
        Insert: {
          collection_id: string
          component_id: number
          created_at?: string
        }
        Update: {
          collection_id?: string
          component_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "components_to_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "components_to_collections_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      crawled_app_flows: {
        Row: {
          app_id: string
          created_at: string
          id: string
          name: string
          pages: string[]
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          name?: string
          pages?: string[]
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          name?: string
          pages?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "crawled_app_flows_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "crawled_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_app_tags: {
        Row: {
          app_id: string
          created_at: string | null
          id: number
          tag_id: number
        }
        Insert: {
          app_id: string
          created_at?: string | null
          id?: number
          tag_id: number
        }
        Update: {
          app_id?: string
          created_at?: string | null
          id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "crawled_app_tags_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "crawled_apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crawled_app_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_apps: {
        Row: {
          created_at: string
          domain: string
          icon: string
          id: string
          name: string
          public: boolean
        }
        Insert: {
          created_at?: string
          domain: string
          icon: string
          id?: string
          name: string
          public?: boolean
        }
        Update: {
          created_at?: string
          domain?: string
          icon?: string
          id?: string
          name?: string
          public?: boolean
        }
        Relationships: []
      }
      crawled_apps_bookmarks: {
        Row: {
          app_id: string
          bookmarked_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          bookmarked_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          bookmarked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawled_apps_bookmarks_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "crawled_apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crawled_apps_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "crawled_apps_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_component_bookmarks: {
        Row: {
          bookmarked_at: string | null
          component_id: string
          user_id: string
        }
        Insert: {
          bookmarked_at?: string | null
          component_id: string
          user_id: string
        }
        Update: {
          bookmarked_at?: string | null
          component_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawled_component_bookmarks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "crawled_components"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_components: {
        Row: {
          created_at: string
          description: string | null
          embedding: string | null
          html_id: string | null
          html_styled: string | null
          html_styled_url: string | null
          id: string
          name: string | null
          page_id: string
          processing_attempts: number
          processing_completed_at: string | null
          processing_error: string | null
          processing_started_at: string | null
          processing_status: Database["public"]["Enums"]["processing_status"]
          public: boolean
          screenshot_url: string | null
          tags: Json
          video_preview_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          embedding?: string | null
          html_id?: string | null
          html_styled?: string | null
          html_styled_url?: string | null
          id?: string
          name?: string | null
          page_id: string
          processing_attempts?: number
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          public?: boolean
          screenshot_url?: string | null
          tags: Json
          video_preview_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          embedding?: string | null
          html_id?: string | null
          html_styled?: string | null
          html_styled_url?: string | null
          id?: string
          name?: string | null
          page_id?: string
          processing_attempts?: number
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          public?: boolean
          screenshot_url?: string | null
          tags?: Json
          video_preview_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_components_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "crawled_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_page_bookmarks: {
        Row: {
          bookmarked_at: string | null
          page_id: string
          user_id: string
        }
        Insert: {
          bookmarked_at?: string | null
          page_id: string
          user_id: string
        }
        Update: {
          bookmarked_at?: string | null
          page_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawled_page_bookmarks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "crawled_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_pages: {
        Row: {
          app_icon: string | null
          app_id: string
          app_name: string | null
          created_at: string
          css_full: string | null
          css_full_url: string | null
          decomposition: Json | null
          description: string | null
          embedding: string | null
          html_processed: string | null
          html_processed_url: string | null
          html_source: string | null
          html_source_url: string | null
          id: string
          name: string | null
          preview_screenshot_url: string | null
          processing_attempts: number
          processing_completed_at: string | null
          processing_error: string | null
          processing_started_at: string | null
          processing_status: Database["public"]["Enums"]["processing_status"]
          public: boolean
          screenshot_url: string | null
          tags_all: Json
          tags_page: Json
          url: string
          video_preview_url: string | null
        }
        Insert: {
          app_icon?: string | null
          app_id: string
          app_name?: string | null
          created_at?: string
          css_full?: string | null
          css_full_url?: string | null
          decomposition?: Json | null
          description?: string | null
          embedding?: string | null
          html_processed?: string | null
          html_processed_url?: string | null
          html_source?: string | null
          html_source_url?: string | null
          id?: string
          name?: string | null
          preview_screenshot_url?: string | null
          processing_attempts?: number
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          public?: boolean
          screenshot_url?: string | null
          tags_all: Json
          tags_page: Json
          url: string
          video_preview_url?: string | null
        }
        Update: {
          app_icon?: string | null
          app_id?: string
          app_name?: string | null
          created_at?: string
          css_full?: string | null
          css_full_url?: string | null
          decomposition?: Json | null
          description?: string | null
          embedding?: string | null
          html_processed?: string | null
          html_processed_url?: string | null
          html_source?: string | null
          html_source_url?: string | null
          id?: string
          name?: string | null
          preview_screenshot_url?: string | null
          processing_attempts?: number
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          public?: boolean
          screenshot_url?: string | null
          tags_all?: Json
          tags_page?: Json
          url?: string
          video_preview_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_pages_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "crawled_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_bookmarks: {
        Row: {
          bookmarked_at: string | null
          demo_id: number
          user_id: string
        }
        Insert: {
          bookmarked_at?: string | null
          demo_id: number
          user_id: string
        }
        Update: {
          bookmarked_at?: string | null
          demo_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_demo"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_demo"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "fk_demo_bookmarks_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_demo_bookmarks_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_hunt_scores: {
        Row: {
          created_at: string
          demo_id: number
          final_score: number
          id: number
          installs: number
          round_id: number
          views: number
          votes: number
        }
        Insert: {
          created_at?: string
          demo_id: number
          final_score?: number
          id?: never
          installs?: number
          round_id: number
          views?: number
          votes?: number
        }
        Update: {
          created_at?: string
          demo_id?: number
          final_score?: number
          id?: never
          installs?: number
          round_id?: number
          views?: number
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_hunt_scores_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_scores_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "demo_hunt_scores_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_current_round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_scores_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_hunt_votes: {
        Row: {
          demo_id: number
          id: number
          round_id: number
          user_id: string
          voted_at: string
        }
        Insert: {
          demo_id: number
          id?: never
          round_id: number
          user_id: string
          voted_at?: string
        }
        Update: {
          demo_id?: number
          id?: never
          round_id?: number
          user_id?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_hunt_votes_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_votes_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "demo_hunt_votes_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_current_round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_votes_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "demo_hunt_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_hunt_winners: {
        Row: {
          category: Database["public"]["Enums"]["demo_hunt_category"] | null
          created_at: string
          demo_id: number
          id: number
          is_global: boolean
          prize_tier: number
          round_id: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["demo_hunt_category"] | null
          created_at?: string
          demo_id: number
          id?: never
          is_global?: boolean
          prize_tier: number
          round_id: number
        }
        Update: {
          category?: Database["public"]["Enums"]["demo_hunt_category"] | null
          created_at?: string
          demo_id?: number
          id?: never
          is_global?: boolean
          prize_tier?: number
          round_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_hunt_winners_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_winners_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "demo_hunt_winners_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_current_round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_winners_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_recommendation_tags: {
        Row: {
          tag_slug: string
        }
        Insert: {
          tag_slug: string
        }
        Update: {
          tag_slug?: string
        }
        Relationships: []
      }
      demo_recommendations: {
        Row: {
          bookmarks_count: number
          created_at: string
          demo_id: number
          score: number
          tag_slug: string
          updated_at: string
        }
        Insert: {
          bookmarks_count?: number
          created_at: string
          demo_id: number
          score: number
          tag_slug?: string
          updated_at?: string
        }
        Update: {
          bookmarks_count?: number
          created_at?: string
          demo_id?: number
          score?: number
          tag_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      demo_sandbox_cache: {
        Row: {
          codesandbox_id: string
          created_at: string
          demo_id: number
          id: number
        }
        Insert: {
          codesandbox_id: string
          created_at?: string
          demo_id: number
          id?: number
        }
        Update: {
          codesandbox_id?: string
          created_at?: string
          demo_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_demo_sandbox_cache_demo"
            columns: ["demo_id"]
            isOneToOne: true
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_demo_sandbox_cache_demo"
            columns: ["demo_id"]
            isOneToOne: true
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
        ]
      }
      demo_tags: {
        Row: {
          created_at: string | null
          demo_id: number
          id: number
          tag_id: number
        }
        Insert: {
          created_at?: string | null
          demo_id: number
          id?: never
          tag_id: number
        }
        Update: {
          created_at?: string | null
          demo_id?: number
          id?: never
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_tags_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_tags_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "demo_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      demos: {
        Row: {
          bookmarks_count: number | null
          bundle_hash: string | null
          bundle_html_url: string | null
          compiled_css: string | null
          component_id: number | null
          created_at: string | null
          demo_code: string
          demo_dependencies: Json | null
          demo_direct_registry_dependencies: Json | null
          demo_slug: string
          embedding: string | null
          embedding_oai: string | null
          fts: unknown
          id: number
          name: string | null
          preview_url: string | null
          pro_preview_image_url: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          bookmarks_count?: number | null
          bundle_hash?: string | null
          bundle_html_url?: string | null
          compiled_css?: string | null
          component_id?: number | null
          created_at?: string | null
          demo_code: string
          demo_dependencies?: Json | null
          demo_direct_registry_dependencies?: Json | null
          demo_slug?: string
          embedding?: string | null
          embedding_oai?: string | null
          fts?: unknown
          id?: number
          name?: string | null
          preview_url?: string | null
          pro_preview_image_url?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          bookmarks_count?: number | null
          bundle_hash?: string | null
          bundle_html_url?: string | null
          compiled_css?: string | null
          component_id?: number | null
          created_at?: string | null
          demo_code?: string
          demo_dependencies?: Json | null
          demo_direct_registry_dependencies?: Json | null
          demo_slug?: string
          embedding?: string | null
          embedding_oai?: string | null
          fts?: unknown
          id?: number
          name?: string | null
          preview_url?: string | null
          pro_preview_image_url?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "demos_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "demos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "demos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      desktop_auth_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "desktop_auth_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "desktop_auth_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      desktop_releases: {
        Row: {
          created_at: string
          id: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          version?: string
        }
        Relationships: []
      }
      desktop_sessions: {
        Row: {
          created_at: string
          device_info: string | null
          expires_at: string
          id: string
          last_used_at: string | null
          refresh_token: string
          revoked_at: string | null
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          expires_at: string
          id?: string
          last_used_at?: string | null
          refresh_token: string
          revoked_at?: string | null
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          expires_at?: string
          id?: string
          last_used_at?: string | null
          refresh_token?: string
          revoked_at?: string | null
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "desktop_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "desktop_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_user_links: {
        Row: {
          created_at: string | null
          discord_user_id: string
          discord_username: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discord_user_id: string
          discord_username?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          discord_user_id?: string
          discord_username?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discord_user_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "discord_user_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_preferences: {
        Row: {
          created_at: string | null
          id: string
          include_from_followed: boolean | null
          include_personalized: boolean | null
          include_trending: boolean | null
          last_newsletter_sent_at: string | null
          newsletter_subscribed: boolean | null
          resend_contact_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          include_from_followed?: boolean | null
          include_personalized?: boolean | null
          include_trending?: boolean | null
          last_newsletter_sent_at?: string | null
          newsletter_subscribed?: boolean | null
          resend_contact_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          include_from_followed?: boolean | null
          include_personalized?: boolean | null
          include_trending?: boolean | null
          last_newsletter_sent_at?: string | null
          newsletter_subscribed?: boolean | null
          resend_contact_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "email_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_analytics: {
        Row: {
          action: string
          created_at: string
          demo_id: number
          feed_type: string
          id: number
          source_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          demo_id: number
          feed_type: string
          id?: number
          source_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          demo_id?: number
          feed_type?: string
          id?: number
          source_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_analytics_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_analytics_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "feed_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: number
          response: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          response?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          response?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      github_code_chunks: {
        Row: {
          code_type: string
          complexity_score: number | null
          component_name: string | null
          contains_api: Json | null
          created_at: string | null
          embedding: string | null
          end_line: number
          file_path: string
          has_jsx: boolean | null
          id: string
          imports: Json | null
          is_simple_wrapper: boolean | null
          language: string | null
          repository: string
          start_line: number
          symbols: Json | null
          tags: Json | null
          team_id: string
          updated_at: string | null
          uses_hooks: boolean | null
        }
        Insert: {
          code_type: string
          complexity_score?: number | null
          component_name?: string | null
          contains_api?: Json | null
          created_at?: string | null
          embedding?: string | null
          end_line: number
          file_path: string
          has_jsx?: boolean | null
          id?: string
          imports?: Json | null
          is_simple_wrapper?: boolean | null
          language?: string | null
          repository: string
          start_line: number
          symbols?: Json | null
          tags?: Json | null
          team_id: string
          updated_at?: string | null
          uses_hooks?: boolean | null
        }
        Update: {
          code_type?: string
          complexity_score?: number | null
          component_name?: string | null
          contains_api?: Json | null
          created_at?: string | null
          embedding?: string | null
          end_line?: number
          file_path?: string
          has_jsx?: boolean | null
          id?: string
          imports?: Json | null
          is_simple_wrapper?: boolean | null
          language?: string | null
          repository?: string
          start_line?: number
          symbols?: Json | null
          tags?: Json | null
          team_id?: string
          updated_at?: string | null
          uses_hooks?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "github_code_chunks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_tasks: {
        Row: {
          chat_id: string
          created_at: string
          external_id: string
          external_title: string | null
          external_url: string | null
          id: string
          metadata: Json | null
          platform: string
          pr_url: string | null
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          external_id: string
          external_title?: string | null
          external_url?: string | null
          id?: string
          metadata?: Json | null
          platform: string
          pr_url?: string | null
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          external_id?: string
          external_title?: string | null
          external_url?: string | null
          id?: string
          metadata?: Json | null
          platform?: string
          pr_url?: string | null
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_tasks_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: true
            referencedRelation: "agent_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chat_analytics: {
        Row: {
          action: string | null
          created_at: string
          id: number
          metadata: Json | null
          project_id: string | null
          snapshot_id: string
          source: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: number
          metadata?: Json | null
          project_id?: string | null
          snapshot_id: string
          source?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: number
          metadata?: Json | null
          project_id?: string | null
          snapshot_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_chat_analytics_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "magic_chat_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chat_commit_hash_to_message: {
        Row: {
          commit_hash: string | null
          created_at: string
          id: string
          magic_chat_id: string | null
          message_id: string | null
        }
        Insert: {
          commit_hash?: string | null
          created_at?: string
          id?: string
          magic_chat_id?: string | null
          message_id?: string | null
        }
        Update: {
          commit_hash?: string | null
          created_at?: string
          id?: string
          magic_chat_id?: string | null
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_chat_commit_hash_to_message_magic_chat_id_fkey"
            columns: ["magic_chat_id"]
            isOneToOne: false
            referencedRelation: "magic_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chat_logs: {
        Row: {
          config: Json
          created_at: string
          error_log: string | null
          id: number
          log: string
          profile: Json
          profile_log: string | null
          total_time: number
          user_message_id: string
        }
        Insert: {
          config: Json
          created_at?: string
          error_log?: string | null
          id?: number
          log: string
          profile: Json
          profile_log?: string | null
          total_time: number
          user_message_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          error_log?: string | null
          id?: number
          log?: string
          profile?: Json
          profile_log?: string | null
          total_time?: number
          user_message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magic_chat_logs_user_message_id_fkey"
            columns: ["user_message_id"]
            isOneToOne: false
            referencedRelation: "magic_chat_messages_users"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chat_messages_assistants: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          deleted_at: string | null
          error: string | null
          id: string
          snapshot_id: string | null
          status: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          error?: string | null
          id?: string
          snapshot_id?: string | null
          status: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          error?: string | null
          id?: string
          snapshot_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "magic_chat_messages_assistants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "magic_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magic_chat_messages_assistants_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "magic_chat_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chat_messages_users: {
        Row: {
          chat_id: string
          content: string
          context: Json | null
          created_at: string
          deleted_at: string | null
          id: string
        }
        Insert: {
          chat_id: string
          content: string
          context?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
        }
        Update: {
          chat_id?: string
          content?: string
          context?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magic_chat_messages_users_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "magic_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chat_snapshots: {
        Row: {
          code: string | null
          codesandbox_id: string | null
          created_at: string
          id: string
          preview_url: string | null
        }
        Insert: {
          code?: string | null
          codesandbox_id?: string | null
          created_at?: string
          id?: string
          preview_url?: string | null
        }
        Update: {
          code?: string | null
          codesandbox_id?: string | null
          created_at?: string
          id?: string
          preview_url?: string | null
        }
        Relationships: []
      }
      magic_chats: {
        Row: {
          config_slug: string | null
          created_at: string
          deleted_at: string | null
          deploy_slug: string | null
          deployed_at: string | null
          explore_sandbox_id: string | null
          explore_tag: string | null
          id: string
          messages: Json | null
          name: string
          pr_branch: string | null
          pr_created_at: string | null
          pr_url: string | null
          project_id: string
          sandbox_id: string | null
          sandbox_url: string | null
          status: string | null
          stream_id: string | null
        }
        Insert: {
          config_slug?: string | null
          created_at?: string
          deleted_at?: string | null
          deploy_slug?: string | null
          deployed_at?: string | null
          explore_sandbox_id?: string | null
          explore_tag?: string | null
          id?: string
          messages?: Json | null
          name: string
          pr_branch?: string | null
          pr_created_at?: string | null
          pr_url?: string | null
          project_id: string
          sandbox_id?: string | null
          sandbox_url?: string | null
          status?: string | null
          stream_id?: string | null
        }
        Update: {
          config_slug?: string | null
          created_at?: string
          deleted_at?: string | null
          deploy_slug?: string | null
          deployed_at?: string | null
          explore_sandbox_id?: string | null
          explore_tag?: string | null
          id?: string
          messages?: Json | null
          name?: string
          pr_branch?: string | null
          pr_created_at?: string | null
          pr_url?: string | null
          project_id?: string
          sandbox_id?: string | null
          sandbox_url?: string | null
          status?: string | null
          stream_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_chats_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "magic_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_chats_old: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          timestamp: string
          variant_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          timestamp?: string
          variant_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          timestamp?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_variant"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "magic_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_clone_site_cache: {
        Row: {
          created_at: string
          id: number
          sandbox_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          sandbox_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          sandbox_id?: string
          url?: string
        }
        Relationships: []
      }
      magic_generations: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "magic_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_prefill_text: {
        Row: {
          created_at: string
          id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
        }
        Relationships: []
      }
      magic_projects: {
        Row: {
          canvas_snapshot: Json | null
          created_at: string
          deleted_at: string | null
          id: string
          is_mcp: boolean
          is_public: boolean | null
          name: string
          preview_url: string | null
          team_id: string | null
          user_id: string
        }
        Insert: {
          canvas_snapshot?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_mcp?: boolean
          is_public?: boolean | null
          name: string
          preview_url?: string | null
          team_id?: string | null
          user_id: string
        }
        Update: {
          canvas_snapshot?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_mcp?: boolean
          is_public?: boolean | null
          name?: string
          preview_url?: string | null
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magic_projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magic_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "magic_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_sub_chats: {
        Row: {
          chat_id: string | null
          created_at: string
          deleted_at: string | null
          id: string
          messages: Json | null
          name: string | null
          stream_id: string | null
          updated_at: string | null
        }
        Insert: {
          chat_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          messages?: Json | null
          name?: string | null
          stream_id?: string | null
          updated_at?: string | null
        }
        Update: {
          chat_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          messages?: Json | null
          name?: string | null
          stream_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      magic_variants: {
        Row: {
          created_at: string | null
          current_version_id: string | null
          error: string | null
          generation_id: string
          id: string
          metadata_config: Json | null
          position: number
          state: string
        }
        Insert: {
          created_at?: string | null
          current_version_id?: string | null
          error?: string | null
          generation_id: string
          id?: string
          metadata_config?: Json | null
          position: number
          state: string
        }
        Update: {
          created_at?: string | null
          current_version_id?: string | null
          error?: string | null
          generation_id?: string
          id?: string
          metadata_config?: Json | null
          position?: number
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_generation"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "magic_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magic_variants_current_version_id_fkey"
            columns: ["current_version_id"]
            isOneToOne: true
            referencedRelation: "magic_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      magic_versions: {
        Row: {
          code: string
          created_at: string
          id: string
          preview_url: string
          variant_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          preview_url: string
          variant_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          preview_url?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_variant_version"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "magic_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_component_usage: {
        Row: {
          author_id: string
          author_share: number
          component_id: number
          created_at: string | null
          generation_request_id: number
          id: number
          payout_id: number | null
          payout_status: string
        }
        Insert: {
          author_id: string
          author_share: number
          component_id: number
          created_at?: string | null
          generation_request_id: number
          id?: never
          payout_id?: number | null
          payout_status?: string
        }
        Update: {
          author_id?: string
          author_share?: number
          component_id?: number
          created_at?: string | null
          generation_request_id?: number
          id?: never
          payout_id?: number | null
          payout_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "fk_generation_request"
            columns: ["generation_request_id"]
            isOneToOne: false
            referencedRelation: "mcp_generation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_generation_requests: {
        Row: {
          api_key: string
          created_at: string | null
          generation_cost: number
          id: number
          search_query: string
          subscription_plan: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          generation_cost: number
          id?: never
          search_query: string
          subscription_plan: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          generation_cost?: number
          id?: never
          search_query?: string
          subscription_plan?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sent_demos: {
        Row: {
          demo_id: number
          id: string
          sent_at: string | null
          user_id: string
        }
        Insert: {
          demo_id: number
          id?: string
          sent_at?: string | null
          user_id: string
        }
        Update: {
          demo_id?: number
          id?: string
          sent_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_rates: {
        Row: {
          active_from: string
          active_till: string | null
          activity_type: string
          created_at: string
          id: number
          price: number
          user_id: string | null
        }
        Insert: {
          active_from: string
          active_till?: string | null
          activity_type: string
          created_at?: string
          id?: number
          price: number
          user_id?: string | null
        }
        Update: {
          active_from?: string
          active_till?: string | null
          activity_type?: string
          created_at?: string
          id?: number
          price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_rates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payout_rates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          add_usage: number | null
          created_at: string
          env: string | null
          id: number
          period: string | null
          price: number | null
          stripe_plan_id: string | null
          type: string | null
          version: number
        }
        Insert: {
          add_usage?: number | null
          created_at?: string
          env?: string | null
          id?: number
          period?: string | null
          price?: number | null
          stripe_plan_id?: string | null
          type?: string | null
          version?: number
        }
        Update: {
          add_usage?: number | null
          created_at?: string
          env?: string | null
          id?: number
          period?: string | null
          price?: number | null
          stripe_plan_id?: string | null
          type?: string | null
          version?: number
        }
        Relationships: []
      }
      product_feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          nps_score: number | null
          pmf_score: number | null
          product: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          nps_score?: number | null
          pmf_score?: number | null
          product: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          nps_score?: number | null
          pmf_score?: number | null
          product?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_feedback_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_product_feedback_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_favorites: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_favorites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "magic_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_previews: {
        Row: {
          canvas_snapshot_hash: string | null
          error_message: string | null
          file_size_bytes: number | null
          generated_at: string | null
          has_screenshots: boolean | null
          has_urls: boolean | null
          id: string
          preview_urls: Json | null
          processing_status: string | null
          project_id: string
          screenshot_urls: Json | null
          thumbnail_url: string | null
        }
        Insert: {
          canvas_snapshot_hash?: string | null
          error_message?: string | null
          file_size_bytes?: number | null
          generated_at?: string | null
          has_screenshots?: boolean | null
          has_urls?: boolean | null
          id?: string
          preview_urls?: Json | null
          processing_status?: string | null
          project_id: string
          screenshot_urls?: Json | null
          thumbnail_url?: string | null
        }
        Update: {
          canvas_snapshot_hash?: string | null
          error_message?: string | null
          file_size_bytes?: number | null
          generated_at?: string | null
          has_screenshots?: boolean | null
          has_urls?: boolean | null
          id?: string
          preview_urls?: Json | null
          processing_status?: string | null
          project_id?: string
          screenshot_urls?: Json | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_previews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "magic_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_rules: {
        Row: {
          additional_context: string | null
          created_at: string | null
          id: number
          name: string
          tech_stack: Json | null
          theme: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_context?: string | null
          created_at?: string | null
          id?: number
          name: string
          tech_stack?: Json | null
          theme?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_context?: string | null
          created_at?: string | null
          id?: number
          name?: string
          tech_stack?: Json | null
          theme?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_prompt_rules_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_prompt_rules_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: number
          notes: string | null
          payment_date: string
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: number
          notes?: string | null
          payment_date: string
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: number
          notes?: string | null
          payment_date?: string
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sandbox_keepalive_logs: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          errors: Json | null
          failed: number
          id: string
          skipped: number | null
          success: number
          total: number
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          errors?: Json | null
          failed: number
          id?: string
          skipped?: number | null
          success: number
          total: number
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          errors?: Json | null
          failed?: number
          id?: string
          skipped?: number | null
          success?: number
          total?: number
        }
        Relationships: []
      }
      sandboxes: {
        Row: {
          codesandbox_id: string | null
          component_id: number | null
          created_at: string
          id: string
          name: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          codesandbox_id?: string | null
          component_id?: number | null
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          codesandbox_id?: string | null
          component_id?: number | null
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sandbox_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sandbox_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "sandboxes_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      scheduled_emails: {
        Row: {
          created_at: string
          email: string
          email_type: Database["public"]["Enums"]["ScheduledEmailType"]
          error_message: string | null
          id: string
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["EmailStatus"]
          user_data: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          email_type: Database["public"]["Enums"]["ScheduledEmailType"]
          error_message?: string | null
          id?: string
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["EmailStatus"]
          user_data?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          email_type?: Database["public"]["Enums"]["ScheduledEmailType"]
          error_message?: string | null
          id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["EmailStatus"]
          user_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "scheduled_emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          component_id: number
          created_at: string | null
          notes: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_id: string | null
          posted_at: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["social_post_status"] | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          component_id: number
          created_at?: string | null
          notes?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_id?: string | null
          posted_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["social_post_status"] | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          component_id?: number
          created_at?: string | null
          notes?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          post_id?: string | null
          posted_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["social_post_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "social_posts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      style_profiles: {
        Row: {
          created_by_team_id: string | null
          css: string | null
          error_message: string | null
          generated_at: string | null
          id: string
          is_public: boolean | null
          markdown_content: string
          site_name: string | null
          source_type: string | null
          status: string | null
          structured_data: Json | null
          updated_at: string | null
          url: string
          url_slug: string
        }
        Insert: {
          created_by_team_id?: string | null
          css?: string | null
          error_message?: string | null
          generated_at?: string | null
          id?: string
          is_public?: boolean | null
          markdown_content: string
          site_name?: string | null
          source_type?: string | null
          status?: string | null
          structured_data?: Json | null
          updated_at?: string | null
          url: string
          url_slug: string
        }
        Update: {
          created_by_team_id?: string | null
          css?: string | null
          error_message?: string | null
          generated_at?: string | null
          id?: string
          is_public?: boolean | null
          markdown_content?: string
          site_name?: string | null
          source_type?: string | null
          status?: string | null
          structured_data?: Json | null
          updated_at?: string | null
          url?: string
          url_slug?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          component_id: number
          created_at: string
          id: number
          moderators_feedback: string | null
          status: Database["public"]["Enums"]["submission_status"]
        }
        Insert: {
          component_id: number
          created_at?: string
          id?: number
          moderators_feedback?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
        }
        Update: {
          component_id?: number
          created_at?: string
          id?: number
          moderators_feedback?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
        }
        Relationships: [
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "submissions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      system_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean
          message: string
          severity: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean
          message: string
          severity?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean
          message?: string
          severity?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tasteboard_snapshots: {
        Row: {
          created_at: string | null
          id: string
          snapshot: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          snapshot: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          snapshot?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasteboard_snapshots_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_tasteboard_snapshots_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invite_links: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          team_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          team_id: string
          token: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          team_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invite_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_invite_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invite_links_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          id: string
          team_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          team_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_pending_invites: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string
          last_sent_at: string
          status: string
          team_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by: string
          last_sent_at?: string
          status?: string
          team_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string
          last_sent_at?: string
          status?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_pending_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_pending_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_pending_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_repository_sandboxes: {
        Row: {
          created_at: string
          env_vars: Json | null
          file_tree: Json | null
          framework: string | null
          id: string
          installation_id: string | null
          repository: string
          sandbox_config: Json | null
          sandbox_id: string | null
          setup_error: string | null
          setup_status: string
          team_id: string
          updated_at: string
          wizard_messages: Json | null
        }
        Insert: {
          created_at?: string
          env_vars?: Json | null
          file_tree?: Json | null
          framework?: string | null
          id?: string
          installation_id?: string | null
          repository: string
          sandbox_config?: Json | null
          sandbox_id?: string | null
          setup_error?: string | null
          setup_status?: string
          team_id: string
          updated_at?: string
          wizard_messages?: Json | null
        }
        Update: {
          created_at?: string
          env_vars?: Json | null
          file_tree?: Json | null
          framework?: string | null
          id?: string
          installation_id?: string | null
          repository?: string
          sandbox_config?: Json | null
          sandbox_id?: string | null
          setup_error?: string | null
          setup_status?: string
          team_id?: string
          updated_at?: string
          wizard_messages?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "team_repository_sandboxes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_style_profiles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          relationship_type: string | null
          style_profile_id: string
          team_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          relationship_type?: string | null
          style_profile_id: string
          team_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          relationship_type?: string | null
          style_profile_id?: string
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_style_profiles_style_profile_id_fkey"
            columns: ["style_profile_id"]
            isOneToOne: false
            referencedRelation: "style_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_style_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          claude_code_integration: Json | null
          created_at: string
          cursor_integration: Json | null
          description: string | null
          discord_guild_id: string | null
          discord_integration: Json | null
          figma_integration: Json | null
          figma_mcp_url: string | null
          github_installation_id: string | null
          github_integration: Json | null
          github_sandbox_config: Json | null
          github_sandbox_env_vars: Json | null
          github_sandbox_id: string | null
          github_sandbox_preview_token: string | null
          id: string
          image_url: string | null
          linear_integration: Json | null
          name: string
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          claude_code_integration?: Json | null
          created_at?: string
          cursor_integration?: Json | null
          description?: string | null
          discord_guild_id?: string | null
          discord_integration?: Json | null
          figma_integration?: Json | null
          figma_mcp_url?: string | null
          github_installation_id?: string | null
          github_integration?: Json | null
          github_sandbox_config?: Json | null
          github_sandbox_env_vars?: Json | null
          github_sandbox_id?: string | null
          github_sandbox_preview_token?: string | null
          id?: string
          image_url?: string | null
          linear_integration?: Json | null
          name: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          claude_code_integration?: Json | null
          created_at?: string
          cursor_integration?: Json | null
          description?: string | null
          discord_guild_id?: string | null
          discord_integration?: Json | null
          figma_integration?: Json | null
          figma_mcp_url?: string | null
          github_installation_id?: string | null
          github_integration?: Json | null
          github_sandbox_config?: Json | null
          github_sandbox_env_vars?: Json | null
          github_sandbox_id?: string | null
          github_sandbox_preview_token?: string | null
          id?: string
          image_url?: string | null
          linear_integration?: Json | null
          name?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          downloads_count: number | null
          id: number
          is_public: boolean | null
          likes_count: number | null
          name: string
          payment_url: string | null
          preview_url: string
          price: number
          template_slug: string
          updated_at: string
          user_id: string
          video_url: string | null
          website_preview_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          id?: number
          is_public?: boolean | null
          likes_count?: number | null
          name: string
          payment_url?: string | null
          preview_url: string
          price?: number
          template_slug: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          website_preview_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          id?: number
          is_public?: boolean | null
          likes_count?: number | null
          name?: string
          payment_url?: string | null
          preview_url?: string
          price?: number
          template_slug?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          website_preview_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_tags: {
        Row: {
          created_at: string | null
          id: number
          tag_id: number
          template_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          tag_id: number
          template_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          tag_id?: number
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "templates_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_tags_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens_usages: {
        Row: {
          created_at: string
          id: number
          input_tokens: number | null
          output_tokens: number | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          input_tokens?: number | null
          output_tokens?: number | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          input_tokens?: number | null
          output_tokens?: number | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "token_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      toolbar_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          last_used_at: string | null
          refresh_token: string | null
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          last_used_at?: string | null
          refresh_token?: string | null
          token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          last_used_at?: string | null
          refresh_token?: string | null
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_toolbar_tokens_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_toolbar_tokens_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_embeddings: {
        Row: {
          created_at: string | null
          embedding: string
          id: string
          item_id: number
          item_type: string
          metadata: Json | null
          usage_description: string | null
        }
        Insert: {
          created_at?: string | null
          embedding: string
          id?: string
          item_id: number
          item_type: string
          metadata?: Json | null
          usage_description?: string | null
        }
        Update: {
          created_at?: string | null
          embedding?: string
          id?: string
          item_id?: number
          item_type?: string
          metadata?: Json | null
          usage_description?: string | null
        }
        Relationships: []
      }
      usages: {
        Row: {
          created_at: string
          id: number
          limit: number | null
          usage: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          limit?: number | null
          usage?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          limit?: number | null
          usage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          followed_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          followed_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          followed_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          bundles_fee: number
          company_size: string | null
          created_at: string
          display_image_url: string | null
          display_name: string | null
          display_username: string | null
          donation_url: string | null
          email: string
          github_installations: Json | null
          github_url: string | null
          id: string
          image_url: string | null
          is_admin: boolean
          is_partner: boolean | null
          manually_added: boolean
          name: string | null
          onboarding_completed_at: string | null
          onboarding_industry: string | null
          onboarding_platform: string | null
          onboarding_referral: string | null
          paypal_email: string | null
          primary_coding_agent: string | null
          primary_coding_agent_other: string | null
          pro_banner_url: string | null
          pro_referral_url: string | null
          ref: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          stripe_id: string | null
          twitter_url: string | null
          updated_at: string | null
          username: string | null
          website_url: string | null
          what_describes_you_best: string | null
          what_describes_you_best_other: string | null
        }
        Insert: {
          bio?: string | null
          bundles_fee?: number
          company_size?: string | null
          created_at?: string
          display_image_url?: string | null
          display_name?: string | null
          display_username?: string | null
          donation_url?: string | null
          email?: string
          github_installations?: Json | null
          github_url?: string | null
          id: string
          image_url?: string | null
          is_admin?: boolean
          is_partner?: boolean | null
          manually_added?: boolean
          name?: string | null
          onboarding_completed_at?: string | null
          onboarding_industry?: string | null
          onboarding_platform?: string | null
          onboarding_referral?: string | null
          paypal_email?: string | null
          primary_coding_agent?: string | null
          primary_coding_agent_other?: string | null
          pro_banner_url?: string | null
          pro_referral_url?: string | null
          ref?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          stripe_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
          what_describes_you_best?: string | null
          what_describes_you_best_other?: string | null
        }
        Update: {
          bio?: string | null
          bundles_fee?: number
          company_size?: string | null
          created_at?: string
          display_image_url?: string | null
          display_name?: string | null
          display_username?: string | null
          donation_url?: string | null
          email?: string
          github_installations?: Json | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_admin?: boolean
          is_partner?: boolean | null
          manually_added?: boolean
          name?: string | null
          onboarding_completed_at?: string | null
          onboarding_industry?: string | null
          onboarding_platform?: string | null
          onboarding_referral?: string | null
          paypal_email?: string | null
          primary_coding_agent?: string | null
          primary_coding_agent_other?: string | null
          pro_banner_url?: string | null
          pro_referral_url?: string | null
          ref?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          stripe_id?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
          what_describes_you_best?: string | null
          what_describes_you_best_other?: string | null
        }
        Relationships: []
      }
      users_to_plans: {
        Row: {
          created_at: string
          id: number
          last_paid_at: string | null
          meta: Json | null
          plan_id: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          last_paid_at?: string | null
          meta?: Json | null
          plan_id?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          last_paid_at?: string | null
          meta?: Json | null
          plan_id?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_to_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_to_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_to_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_to_plans_agents: {
        Row: {
          created_at: string
          id: number
          last_paid_at: string | null
          meta: Json | null
          plan_id: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          last_paid_at?: string | null
          meta?: Json | null
          plan_id?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          last_paid_at?: string | null
          meta?: Json | null
          plan_id?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_to_plans_agents_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_to_plans_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_to_plans_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          company_size: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          what_describes_you_best: string | null
          what_describes_you_best_other: string | null
        }
        Insert: {
          company_size?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          what_describes_you_best?: string | null
          what_describes_you_best_other?: string | null
        }
        Update: {
          company_size?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          what_describes_you_best?: string | null
          what_describes_you_best_other?: string | null
        }
        Relationships: []
      }
      weekly_top_demos: {
        Row: {
          created_at: string
          demo_id: number
          id: number
          prize_tier: number
          score: number
          week: string
        }
        Insert: {
          created_at?: string
          demo_id: number
          id?: number
          prize_tier: number
          score?: number
          week: string
        }
        Update: {
          created_at?: string
          demo_id?: number
          id?: number
          prize_tier?: number
          score?: number
          week?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_top_demos_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_top_demos_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
        ]
      }
    }
    Views: {
      component_activity_mv: {
        Row: {
          component_id: number | null
          downloads_count: number | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      component_dependencies_graph_view: {
        Row: {
          code: string | null
          component_id: number | null
          component_names: Json | null
          component_slug: string | null
          created_at: string | null
          demo_code: string | null
          demo_dependencies: Json | null
          demo_direct_registry_dependencies: Json | null
          dependencies: Json | null
          dependency_author_display_username: string | null
          dependency_author_username: string | null
          dependency_component_id: number | null
          depth: number | null
          description: string | null
          direct_registry_dependencies: Json | null
          downloads_count: number | null
          fts: unknown
          id: number | null
          is_demo_dependency: boolean | null
          is_public: boolean | null
          license: string | null
          likes_count: number | null
          name: string | null
          preview_url: string | null
          registry: string | null
          source_author_display_username: string | null
          source_author_username: string | null
          source_component_slug: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      component_dependencies_graph_view_v2: {
        Row: {
          code: string | null
          component_id: number | null
          component_names: Json | null
          component_slug: string | null
          created_at: string | null
          demo_code: string | null
          demo_dependencies: Json | null
          demo_direct_registry_dependencies: Json | null
          dependencies: Json | null
          dependency_author_display_username: string | null
          dependency_author_username: string | null
          dependency_component_id: number | null
          depth: number | null
          description: string | null
          direct_registry_dependencies: Json | null
          downloads_count: number | null
          fts: unknown
          global_css_extension: string | null
          id: number | null
          is_demo_dependency: boolean | null
          is_public: boolean | null
          license: string | null
          likes_count: number | null
          name: string | null
          preview_url: string | null
          registry: string | null
          source_author_display_username: string | null
          source_author_username: string | null
          source_component_slug: string | null
          tailwind_config_extension: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      component_dependencies_graph_view_v3: {
        Row: {
          code: string | null
          component_id: number | null
          component_names: Json | null
          component_slug: string | null
          created_at: string | null
          demo_code: string | null
          demo_dependencies: Json | null
          demo_direct_registry_dependencies: Json | null
          dependencies: Json | null
          dependency_author_display_username: string | null
          dependency_author_username: string | null
          dependency_component_id: number | null
          depth: number | null
          description: string | null
          direct_registry_dependencies: Json | null
          downloads_count: number | null
          fts: unknown
          global_css_extension: string | null
          id: number | null
          is_demo_dependency: boolean | null
          is_public: boolean | null
          license: string | null
          likes_count: number | null
          name: string | null
          preview_url: string | null
          registry: string | null
          source_author_display_username: string | null
          source_author_username: string | null
          source_component_slug: string | null
          tailwind_config_extension: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_dependencies_closure_dependency_component_id_fkey"
            columns: ["dependency_component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      component_hunt_current_round: {
        Row: {
          end_at: string | null
          id: number | null
          seasonal_tag_id: number | null
          start_at: string | null
          week_number: number | null
        }
        Relationships: [
          {
            foreignKeyName: "component_hunt_rounds_seasonal_tag_id_fkey"
            columns: ["seasonal_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      component_stats: {
        Row: {
          count: number | null
          filter_type: string | null
        }
        Relationships: []
      }
      components_with_username: {
        Row: {
          code: string | null
          component_names: Json | null
          component_slug: string | null
          created_at: string | null
          demo_code: string | null
          demo_dependencies: Json | null
          demo_direct_registry_dependencies: Json | null
          dependencies: Json | null
          description: string | null
          direct_registry_dependencies: Json | null
          downloads_count: number | null
          fts: unknown
          id: number | null
          is_public: boolean | null
          license: string | null
          likes_count: number | null
          name: string | null
          preview_url: string | null
          registry: string | null
          updated_at: string | null
          user: Json | null
          user_id: string | null
          username: string | null
          video_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "referral_analytics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "components_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_apps_bookmarks_mv: {
        Row: {
          app_id: string | null
          bookmarks_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_apps_bookmarks_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "crawled_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_component_bookmarks_mv: {
        Row: {
          bookmarks_count: number | null
          component_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_component_bookmarks_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "crawled_components"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_page_bookmarks_mv: {
        Row: {
          bookmarks_count: number | null
          page_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_page_bookmarks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "crawled_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_bookmarks_mv: {
        Row: {
          bookmarks_count: number | null
          demo_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_demo"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_demo"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
        ]
      }
      demo_hunt_leaderboard: {
        Row: {
          bookmarks_count: number | null
          bundle_url: Json | null
          component_data: Json | null
          component_user_data: Json | null
          demo_slug: string | null
          final_score: number | null
          global_rank: number | null
          has_voted: boolean | null
          id: number | null
          installs: number | null
          name: string | null
          preview_url: string | null
          round_id: number | null
          tags: Json | null
          total_count: number | null
          updated_at: string | null
          user_data: Json | null
          video_url: string | null
          view_count: number | null
          votes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_hunt_scores_demo_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_scores_demo_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
          {
            foreignKeyName: "demo_hunt_scores_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_current_round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_hunt_scores_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "component_hunt_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_recommendations_mv: {
        Row: {
          bookmarks_count: number | null
          created_at: string | null
          demo_id: number | null
          score: number | null
          tag_slug: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      monthly_referral_analytics: {
        Row: {
          avg_amount: number | null
          month: string | null
          payments_count: number | null
          total_amount: number | null
        }
        Relationships: []
      }
      mv_component_analytics: {
        Row: {
          activity_type: string | null
          component_id: number | null
          count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      mv_detailed_component_analytics: {
        Row: {
          anon_cli_download_count: number | null
          anon_total_installs: number | null
          anon_view_count: number | null
          auth_cli_download_count: number | null
          auth_total_installs: number | null
          auth_valid_code_copy_count: number | null
          auth_valid_prompt_copy_count: number | null
          auth_view_count: number | null
          component_id: number | null
          demo_id: number | null
          total_cli_download_count: number | null
          total_installs: number | null
          total_view_count: number | null
          weighted_auth_installs: number | null
        }
        Relationships: []
      }
      mv_recent_component_metrics: {
        Row: {
          component_id: number | null
          installs_48h: number | null
          views_48h: number | null
        }
        Relationships: [
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_dependencies_graph_view_v3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_username"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_analytics_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "tag_demo_stats_mv"
            referencedColumns: ["component_id"]
          },
        ]
      }
      referral_analytics: {
        Row: {
          avg_payment: number | null
          email: string | null
          first_payment: string | null
          last_payment: string | null
          referral_code: string | null
          total_earned: number | null
          total_payments: number | null
          user_id: string | null
        }
        Relationships: []
      }
      tag_demo_stats_mv: {
        Row: {
          bookmarks_count: number | null
          component_id: number | null
          created_at: string | null
          demo_id: number | null
          downloads_count: number | null
          tag_slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_tags_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_tags_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "mv_detailed_component_analytics"
            referencedColumns: ["demo_id"]
          },
        ]
      }
    }
    Functions: {
      analyze_author_payouts: {
        Args: never
        Returns: {
          actual_amount: number
          author_id: string
          display_name: string
          free_plan_usage: number
          has_payouts: boolean
          last_payout_date: string
          last_payout_status: string
          paid_plan_usage: number
          potential_amount: number
          published_components: number
          total_usage: number
          username: string
        }[]
      }
      analyze_component_usage: {
        Args: never
        Returns: {
          author_id: string
          component_id: number
          component_name: string
          display_name: string
          free_plan_usage: number
          has_payouts: boolean
          paid_plan_usage: number
          total_amount: number
          total_usage: number
          username: string
        }[]
      }
      check_api_key: { Args: { api_key: string }; Returns: Json }
      check_api_key_v2: { Args: { api_key: string }; Returns: Json }
      cleanup_expired_desktop_auth_codes: { Args: never; Returns: undefined }
      create_api_key: {
        Args: {
          plan?: Database["public"]["Enums"]["api_plan"]
          requests_limit?: number
          user_id: string
        }
        Returns: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key: string | null
          key_hash: string | null
          key_prefix: string | null
          last_used_at: string | null
          plan: Database["public"]["Enums"]["api_plan"] | null
          project_url: string | null
          requests_count: number | null
          requests_limit: number | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "api_keys"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_component: { Args: { component_id: number }; Returns: boolean }
      find_pg_column_dependencies: {
        Args: {
          column_name_param: string
          schema_name_param: string
          table_name_param: string
        }
        Returns: {
          dependency_type_info: string
          dependent_object_description: string
        }[]
      }
      get_active_authors: {
        Args: never
        Returns: {
          bio: string
          display_image_url: string
          display_name: string
          display_username: string
          id: string
          image_url: string
          name: string
          total_downloads: number
          total_engagement: number
          total_usages: number
          total_views: number
          username: string
        }[]
      }
      get_active_authors_with_top_components: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          bio: string
          display_image_url: string
          display_name: string
          display_username: string
          id: string
          image_url: string
          name: string
          top_components: Json
          total_count: number
          total_downloads: number
          total_engagement: number
          total_usages: number
          total_views: number
          username: string
        }[]
      }
      get_admin_liked_demos_v1: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_all_author_payouts: {
        Args: {
          p_limit?: number
          p_max_amount?: number
          p_min_amount?: number
          p_offset?: number
          p_period?: string
          p_sort_by?: string
          p_sort_order?: string
          p_status?: string
        }
        Returns: Json[]
      }
      get_all_author_payouts_count: {
        Args: {
          p_max_amount?: number
          p_min_amount?: number
          p_period?: string
          p_status?: string
        }
        Returns: number
      }
      get_author_payout_stats: { Args: { p_author_id: string }; Returns: Json }
      get_chunking_stats: {
        Args: never
        Returns: {
          avg_complexity: number
          chunks_by_type: Json
          components_with_chunks: number
          embedded_chunks: number
          pending_chunks: number
          total_chunks: number
        }[]
      }
      get_collection_components_v1: {
        Args: {
          p_collection_id: string
          p_limit: number
          p_offset: number
          p_sort_by: string
        }
        Returns: {
          bookmarks_count: number
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_collections_v1: {
        Args: {
          p_include_private?: boolean
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          components_count: number
          cover_url: string
          created_at: string
          description: string
          id: string
          is_public: boolean
          name: string
          slug: string
          updated_at: string
          user_data: Json
          user_id: string
        }[]
      }
      get_daily_user_earnings: {
        Args: { p_user_id: string }
        Returns: {
          date: string
          mcp_earnings: number
          mcp_usages: number
          total_earnings: number
          views: number
          views_earnings: number
        }[]
      }
      get_daily_user_earnings_v2: {
        Args: { p_user_id: string }
        Returns: {
          cli_downloads: number
          code_copies: number
          date: string
          mcp_usages: number
          prompt_copies: number
          views: number
        }[]
      }
      get_daily_user_earnings_v3: {
        Args: { p_user_id: string }
        Returns: {
          cli_downloads: number
          code_copies: number
          date: string
          mcp_earnings: number
          mcp_paid_usages: number
          mcp_usages: number
          prompt_copies: number
          views: number
        }[]
      }
      get_daily_user_earnings_v4_1: {
        Args: { p_user_id: string }
        Returns: {
          canvas_usage: number
          cli_downloads: number
          code_copies: number
          date: string
          mcp_earnings: number
          mcp_paid_usages: number
          mcp_usages: number
          prompt_copies: number
          views: number
        }[]
      }
      get_demos_list: {
        Args: {
          p_include_private?: boolean
          p_limit: number
          p_offset: number
          p_sort_by: string
          p_tag_slug?: string
        }
        Returns: {
          bookmarks_count: number
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_demos_list_v2: {
        Args: {
          p_include_private?: boolean
          p_limit: number
          p_offset: number
          p_sort_by: string
          p_tag_slug?: string
        }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_demos_list_v3: {
        Args: {
          p_include_private?: boolean
          p_limit?: number
          p_offset?: number
          p_sort_by?: string
          p_tag_slug?: string
        }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_demos_submissions: {
        Args: {
          p_include_private?: boolean
          p_limit: number
          p_offset: number
          p_sort_by: string
          p_tag_slug?: string
        }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          moderators_feedback: string
          name: string
          preview_url: string
          submission_status: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_hunt_demos_list: {
        Args: { p_round_id: number }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          final_score: number
          global_rank: number
          has_voted: boolean
          id: number
          installs: number
          name: string
          preview_url: string
          tags: Json
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
          votes: number
        }[]
      }
      get_hunt_demos_list_v2: {
        Args: { p_round_id: number }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          final_score: number
          global_rank: number
          has_voted: boolean
          id: number
          installs: number
          name: string
          preview_url: string
          tags: Json
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
          votes: number
        }[]
      }
      get_hunt_demos_list_v3: {
        Args: { p_round_id: number }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          demo_slug: string
          final_score: number
          global_rank: number
          has_voted: boolean
          id: number
          installs: number
          moderators_feedback: string
          name: string
          preview_url: string
          submission_status: string
          tags: Json
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
          votes: number
        }[]
      }
      get_liked_components: { Args: { p_user_id: string }; Returns: Json[] }
      get_missing_usage_embedding_items: {
        Args: never
        Returns: {
          item_id: number
          item_type: string
        }[]
      }
      get_pro_publishers: {
        Args: never
        Returns: {
          bio: string
          created_at: string
          display_image_url: string
          display_name: string
          display_username: string
          email: string
          github_url: string
          id: string
          image_url: string
          is_admin: boolean
          manually_added: boolean
          name: string
          pro_banner_url: string
          pro_referral_url: string
          ref: string
          twitter_url: string
          updated_at: string
          username: string
          website_url: string
        }[]
      }
      get_prompt: {
        Args: {
          p_additional_context?: string
          p_prompt_type: string
          p_rule_id?: number
        }
        Returns: string
      }
      get_section_previews: {
        Args: { p_demo_ids: number[] }
        Returns: {
          demo_id: number
          preview_url: string
          video_url: string
        }[]
      }
      get_stale_style_profiles: {
        Args: { hours_old?: number }
        Returns: {
          generated_at: string
          id: string
          site_name: string
          url: string
        }[]
      }
      get_team_style_profile: {
        Args: { team_uuid: string }
        Returns: {
          colors: Json
          components: Json
          generated_at: string
          logo_url: string
          markdown_content: string
          screenshot_url: string
          shapes: Json
          site_name: string
          spacing: Json
          style_profile_id: string
          typography: Json
          url: string
        }[]
      }
      get_template_tags: {
        Args: never
        Returns: {
          tag_id: number
          tag_name: string
          tag_slug: string
          templates_count: number
        }[]
      }
      get_templates_v3: {
        Args: {
          p_include_private?: boolean
          p_limit?: number
          p_offset?: number
          p_tag_slug?: string
        }
        Returns: {
          created_at: string
          description: string
          downloads_count: number
          id: number
          likes_count: number
          name: string
          payment_url: string
          preview_url: string
          price: number
          updated_at: string
          user_data: Json
          video_url: string
          website_preview_url: string
        }[]
      }
      get_top_components_for_email: {
        Args: never
        Returns: {
          component_slug: string
          demo_preview_url: string
          demo_slug: string
          description: string
          id: string
          is_current_week: boolean
          name: string
          preview_url: string
          username: string
        }[]
      }
      get_user_bookmarks_list: {
        Args: { p_include_private?: boolean; p_user_id: string }
        Returns: {
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          updated_at: string
          user_data: Json
          video_url: string
        }[]
      }
      get_user_components_counts: { Args: { p_user_id: string }; Returns: Json }
      get_user_profile_demo_list: {
        Args: { p_include_private?: boolean; p_user_id: string }
        Returns: {
          component_data: Json
          component_user_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          updated_at: string
          user_data: Json
          video_url: string
        }[]
      }
      get_user_profile_demo_list_v2: {
        Args: { p_user_id: string }
        Returns: {
          bookmarks_count: number
          bundle_url: Json
          component_data: Json
          component_user_data: Json
          created_at: string
          demo_slug: string
          id: number
          is_private: boolean
          moderators_feedback: string
          name: string
          preview_url: string
          submission_status: string
          total_count: number
          updated_at: string
          user_data: Json
          video_url: string
          view_count: number
        }[]
      }
      get_user_state: { Args: { user_id_param: string }; Returns: Json }
      glob_to_like: { Args: { glob: string }; Returns: string }
      grep_user_codebase: {
        Args: {
          p_case_sensitive: boolean
          p_exclude_pattern: string
          p_include_pattern: string
          p_limit: number
          p_query: string
          p_repository: string
          p_team_id: string
        }
        Returns: Record<string, unknown>
      }
      hunt_component_tag_slugs: { Args: { cid: number }; Returns: string[] }
      hunt_marketing_slugs: { Args: never; Returns: string[] }
      hunt_toggle_demo_vote: {
        Args: { p_demo_id: number; p_round_id: number }
        Returns: boolean
      }
      hunt_ui_slugs: { Args: never; Returns: string[] }
      increment: { Args: never; Returns: number }
      increment_api_requests: { Args: { key_id: string }; Returns: undefined }
      insert_code_embedding: {
        Args: {
          p_code: string
          p_embedding: string
          p_id: string
          p_item_id: number
          p_item_type: string
          p_metadata: Json
        }
        Returns: undefined
      }
      insert_embedding:
        | {
            Args: {
              p_embedding: string
              p_id: string
              p_item_id: number
              p_item_type: string
              p_metadata: Json
              p_usage_description: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_embedding: string
              p_item_id: number
              p_item_type: string
              p_metadata: Json
              p_usage_description: string
            }
            Returns: undefined
          }
      is_admin: { Args: { p_user_id: string }; Returns: boolean }
      is_trigger_operation: { Args: never; Returns: boolean }
      like_component_by_demo: {
        Args: { p_demo_id: number; p_liked: boolean; p_user_id: string }
        Returns: undefined
      }
      match_embeddings: {
        Args: {
          filter?: string
          match_count: number
          match_threshold: number
          query_embedding: string
          table_name?: string
        }
        Returns: {
          embedding: string
          id: string
          item_id: number
          item_type: string
          similarity: number
        }[]
      }
      match_embeddings_with_details: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          component_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          usage_data: Json
          user_data: Json
          user_id: string
          video_url: string
        }[]
      }
      process_next_round: { Args: never; Returns: undefined }
      process_single_round: { Args: { p_round_id: number }; Returns: undefined }
      purchase_component: {
        Args: { p_component_id: number; p_user_id: string }
        Returns: Json
      }
      record_mcp_component_usage:
        | {
            Args: {
              p_api_key: string
              p_author_ids: string[]
              p_component_ids: number[]
              p_search_query: string
              p_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_api_key: string
              p_author_ids: string[]
              p_component_ids: number[]
              p_component_names: string[]
              p_search_query: string
              p_user_id: string
            }
            Returns: Json
          }
      requesting_user_id: { Args: never; Returns: string }
      search_code_chunks: {
        Args: {
          code_type_filter?: string
          component_id_filter?: number
          file_filter?: string
          hooks_filter?: boolean
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          code_type: string
          complexity_score: number
          component_id: number
          component_name: string
          contains_api: Json
          demo_id: number
          file_path: string
          has_jsx: boolean
          id: string
          imports: Json
          similarity: number
          symbols: Json
          uses_hooks: boolean
        }[]
      }
      search_components_preview: {
        Args: { p_search_query: string }
        Returns: {
          component_slug: string
          description: string
          downloads_count: number
          id: number
          likes_count: number
          name: string
          preview_url: string
          user_data: Json
        }[]
      }
      search_demos_ai: {
        Args: {
          match_threshold?: number
          query_embedding?: string
          search_query?: string
        }
        Returns: {
          component_data: Json
          demo_id: number
          id: number
          name: string
          preview_url: string
          usage_data: Json
          user_data: Json
          video_url: string
        }[]
      }
      search_demos_ai_oai: {
        Args: {
          match_threshold?: number
          query_embedding?: string
          search_query?: string
        }
        Returns: {
          component_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          usage_data: Json
          user_data: Json
          user_id: string
          video_url: string
        }[]
      }
      search_demos_ai_oai_v2: {
        Args: {
          match_threshold: number
          query_embedding: string
          search_query: string
        }
        Returns: {
          component_data: Json
          demo_slug: string
          id: number
          name: string
          preview_url: string
          usage_data: Json
          user_data: Json
          user_id: string
          video_url: string
        }[]
      }
      set_team_style_profile: {
        Args: { profile_uuid: string; team_uuid: string }
        Returns: undefined
      }
      set_team_style_profile_by_url: {
        Args: { team_uuid: string; website_url: string }
        Returns: string
      }
      update_all_hunt_scores: { Args: never; Returns: undefined }
      update_component_dependencies_closure: {
        Args: { p_component_id: number; p_demo_slug?: string }
        Returns: undefined
      }
      update_component_with_tags:
        | {
            Args: {
              p_component_id: number
              p_description?: string
              p_license?: string
              p_name?: string
              p_preview_url?: string
              p_tags?: Json
            }
            Returns: undefined
          }
        | {
            Args: {
              p_component_id: number
              p_description?: string
              p_license?: string
              p_name?: string
              p_preview_url?: string
              p_tags?: Json
              p_website_url?: string
            }
            Returns: undefined
          }
      update_demo_info_as_admin: {
        Args: {
          p_component_id: number
          p_demo_name: string
          p_demo_slug: string
        }
        Returns: Json
      }
      update_demo_tags: {
        Args: { p_demo_id: number; p_tags: Json }
        Returns: undefined
      }
      update_hunt_demos_metrics: { Args: never; Returns: undefined }
      update_single_demo_score: {
        Args: { p_demo_id: number; p_round_id: number }
        Returns: {
          anon_installs: number
          anon_views: number
          auth_installs: number
          auth_views: number
          calculation_details: string
          demo_id: number
          demo_name: string
          expected_score: number
          new_final_score: number
          old_final_score: number
          total_installs: number
          total_views: number
          votes_count: number
        }[]
      }
      update_submission_as_admin: {
        Args: {
          p_component_id: number
          p_feedback: string
          p_status: Database["public"]["Enums"]["submission_status"]
        }
        Returns: Json
      }
      update_template_tags: {
        Args: { p_tags: Json; p_template_id: number }
        Returns: undefined
      }
      vec_dim: { Args: { v: string }; Returns: number }
    }
    Enums: {
      announcement_event_type:
        | "shown"
        | "clicked_lets_go"
        | "clicked_remind_later"
        | "closed"
      api_plan: "free" | "pro" | "enterprise"
      bundle_plan_type: "individual" | "team" | "enterprise"
      demo_hunt_category: "marketing" | "ui" | "seasonal"
      EmailStatus: "pending" | "sent" | "failed" | "cancelled"
      payment_status: "pending" | "paid" | "rejected" | "refunded"
      processing_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "retrying"
      ScheduledEmailType: "magic_promo" | "canvas_feedback_request"
      social_platform:
        | "twitter"
        | "instagram"
        | "linkedin"
        | "facebook"
        | "pinterest"
      social_post_status:
        | "awaiting_approval"
        | "approved"
        | "posted"
        | "scheduled"
        | "failed"
      submission_status: "on_review" | "featured" | "posted" | "rejected"
      user_role:
        | "designer"
        | "frontend_developer"
        | "backend_developer"
        | "product_manager"
        | "entrepreneur"
    }
    CompositeTypes: {
      component_with_user: {
        id: number | null
        component_names: Json | null
        description: string | null
        code: string | null
        demo_code: string | null
        created_at: string | null
        updated_at: string | null
        user_id: string | null
        dependencies: Json | null
        is_public: boolean | null
        downloads_count: number | null
        likes_count: number | null
        component_slug: string | null
        name: string | null
        demo_dependencies: Json | null
        registry: string | null
        direct_registry_dependencies: Json | null
        demo_direct_registry_dependencies: Json | null
        preview_url: string | null
        license: string | null
        video_url: string | null
        user_data: Json | null
        compiled_css: string | null
        global_css_extension: string | null
        tailwind_config_extension: string | null
        website_url: string | null
        is_paid: boolean | null
        payment_url: string | null
        price: number | null
        pro_preview_image_url: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_event_type: [
        "shown",
        "clicked_lets_go",
        "clicked_remind_later",
        "closed",
      ],
      api_plan: ["free", "pro", "enterprise"],
      bundle_plan_type: ["individual", "team", "enterprise"],
      demo_hunt_category: ["marketing", "ui", "seasonal"],
      EmailStatus: ["pending", "sent", "failed", "cancelled"],
      payment_status: ["pending", "paid", "rejected", "refunded"],
      processing_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "retrying",
      ],
      ScheduledEmailType: ["magic_promo", "canvas_feedback_request"],
      social_platform: [
        "twitter",
        "instagram",
        "linkedin",
        "facebook",
        "pinterest",
      ],
      social_post_status: [
        "awaiting_approval",
        "approved",
        "posted",
        "scheduled",
        "failed",
      ],
      submission_status: ["on_review", "featured", "posted", "rejected"],
      user_role: [
        "designer",
        "frontend_developer",
        "backend_developer",
        "product_manager",
        "entrepreneur",
      ],
    },
  },
} as const
