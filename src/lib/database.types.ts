export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      image: {
        Row: {
          created_at: string
          height: number | null
          id: string
          url: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          url: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      image_format: {
        Row: {
          format: string
          height: number | null
          id: string
          image_id: string
          url: string
          width: number | null
        }
        Insert: {
          format: string
          height?: number | null
          id?: string
          image_id: string
          url: string
          width?: number | null
        }
        Update: {
          format?: string
          height?: number | null
          id?: string
          image_id?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "image_format_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_format"
            referencedColumns: ["id"]
          },
        ]
      }
      outing: {
        Row: {
          content: string | null
          cotation: string | null
          cover_id: string | null
          created_at: string
          date: string | null
          elevation: number | null
          id: string
          orientation: string | null
          title: string | null
          topos: string[] | null
        }
        Insert: {
          content?: string | null
          cotation?: string | null
          cover_id?: string | null
          created_at?: string
          date?: string | null
          elevation?: number | null
          id?: string
          orientation?: string | null
          title?: string | null
          topos?: string[] | null
        }
        Update: {
          content?: string | null
          cotation?: string | null
          cover_id?: string | null
          created_at?: string
          date?: string | null
          elevation?: number | null
          id?: string
          orientation?: string | null
          title?: string | null
          topos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "outing_cover_id_fkey"
            columns: ["cover_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
        ]
      }
      outing_image: {
        Row: {
          image_id: string
          outing_id: string
        }
        Insert: {
          image_id: string
          outing_id: string
        }
        Update: {
          image_id?: string
          outing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outing_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outing_image_outing_id_fkey"
            columns: ["outing_id"]
            isOneToOne: false
            referencedRelation: "outing"
            referencedColumns: ["id"]
          },
        ]
      }
      outing_participant: {
        Row: {
          outing_id: string
          participant_id: string
        }
        Insert: {
          outing_id: string
          participant_id: string
        }
        Update: {
          outing_id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outing_participant_outing_id_fkey"
            columns: ["outing_id"]
            isOneToOne: false
            referencedRelation: "outing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outing_participant_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant"
            referencedColumns: ["id"]
          },
        ]
      }
      outing_period: {
        Row: {
          outing_id: string
          period_id: string
        }
        Insert: {
          outing_id: string
          period_id: string
        }
        Update: {
          outing_id?: string
          period_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outing_period_outing_id_fkey"
            columns: ["outing_id"]
            isOneToOne: false
            referencedRelation: "outing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outing_period_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "period"
            referencedColumns: ["id"]
          },
        ]
      }
      outing_place: {
        Row: {
          outing_id: string
          place_id: string
        }
        Insert: {
          outing_id: string
          place_id: string
        }
        Update: {
          outing_id?: string
          place_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outing_place_outing_id_fkey"
            columns: ["outing_id"]
            isOneToOne: false
            referencedRelation: "outing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outing_place_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "place"
            referencedColumns: ["id"]
          },
        ]
      }
      outing_sport: {
        Row: {
          outing_id: string
          sport_id: string
        }
        Insert: {
          outing_id: string
          sport_id: string
        }
        Update: {
          outing_id?: string
          sport_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outing_sport_outing_id_fkey"
            columns: ["outing_id"]
            isOneToOne: false
            referencedRelation: "outing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outing_sport_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sport"
            referencedColumns: ["id"]
          },
        ]
      }
      participant: {
        Row: {
          firstname: string | null
          id: string
          lastname: string | null
          surname: string | null
        }
        Insert: {
          firstname?: string | null
          id?: string
          lastname?: string | null
          surname?: string | null
        }
        Update: {
          firstname?: string | null
          id?: string
          lastname?: string | null
          surname?: string | null
        }
        Relationships: []
      }
      period: {
        Row: {
          id: string
          key: string
          label: string | null
        }
        Insert: {
          id?: string
          key: string
          label?: string | null
        }
        Update: {
          id?: string
          key?: string
          label?: string | null
        }
        Relationships: []
      }
      place: {
        Row: {
          id: string
          key: string
          label: string | null
        }
        Insert: {
          id?: string
          key: string
          label?: string | null
        }
        Update: {
          id?: string
          key?: string
          label?: string | null
        }
        Relationships: []
      }
      sport: {
        Row: {
          id: string
          key: string
          label: string
        }
        Insert: {
          id?: string
          key: string
          label: string
        }
        Update: {
          id?: string
          key?: string
          label?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
