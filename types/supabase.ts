export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_npc: {
        Row: {
          accent: string | null
          additional_info: string | null
          alignment: string | null
          attitude: string | null
          background_history: string | null
          character_class: string | null
          conversational_style: string | null
          created_at: string | null
          created_by: string | null
          game: string | null
          game_setting: string | null
          gender: string | null
          id: number
          name: string | null
          personality: string | null
          picture_url: string | null
          race: string | null
          traits: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accent?: string | null
          additional_info?: string | null
          alignment?: string | null
          attitude?: string | null
          background_history?: string | null
          character_class?: string | null
          conversational_style?: string | null
          created_at?: string | null
          created_by?: string | null
          game?: string | null
          game_setting?: string | null
          gender?: string | null
          id?: number
          name?: string | null
          personality?: string | null
          picture_url?: string | null
          race?: string | null
          traits?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accent?: string | null
          additional_info?: string | null
          alignment?: string | null
          attitude?: string | null
          background_history?: string | null
          character_class?: string | null
          conversational_style?: string | null
          created_at?: string | null
          created_by?: string | null
          game?: string | null
          game_setting?: string | null
          gender?: string | null
          id?: number
          name?: string | null
          personality?: string | null
          picture_url?: string | null
          race?: string | null
          traits?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_npc_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_npc_location: {
        Row: {
          created_at: string | null
          id: number
          location: string | null
          npc_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          location?: string | null
          npc_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          location?: string | null
          npc_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_npc_location_npc_id_fkey"
            columns: ["npc_id"]
            referencedRelation: "user_npc"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
