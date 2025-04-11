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
      activity_completions: {
        Row: {
          activity_id: string
          activity_name: string
          completed_at: string
          feedback: string | null
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          activity_name: string
          completed_at?: string
          feedback?: string | null
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          activity_name?: string
          completed_at?: string
          feedback?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_airbnb: {
        Row: {
          appearance_description_text: string | null
          appearance_drawing_path: string | null
          created_at: string
          emotion_drawing_path: string | null
          emotion_text: string | null
          id: string
          intensity_description_text: string | null
          intensity_drawing_path: string | null
          location_in_body_drawing_path: string | null
          location_in_body_text: string | null
          message_description_text: string | null
          message_drawing_path: string | null
          sound_drawing_path: string | null
          sound_text: string | null
          user_id: string
        }
        Insert: {
          appearance_description_text?: string | null
          appearance_drawing_path?: string | null
          created_at?: string
          emotion_drawing_path?: string | null
          emotion_text?: string | null
          id?: string
          intensity_description_text?: string | null
          intensity_drawing_path?: string | null
          location_in_body_drawing_path?: string | null
          location_in_body_text?: string | null
          message_description_text?: string | null
          message_drawing_path?: string | null
          sound_drawing_path?: string | null
          sound_text?: string | null
          user_id: string
        }
        Update: {
          appearance_description_text?: string | null
          appearance_drawing_path?: string | null
          created_at?: string
          emotion_drawing_path?: string | null
          emotion_text?: string | null
          id?: string
          intensity_description_text?: string | null
          intensity_drawing_path?: string | null
          location_in_body_drawing_path?: string | null
          location_in_body_text?: string | null
          message_description_text?: string | null
          message_drawing_path?: string | null
          sound_drawing_path?: string | null
          sound_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_airbnb_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          audio_path: string | null
          content: string | null
          created_at: string
          drawing_path: string | null
          entry_type: string
          id: string
          journal_area: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_path?: string | null
          content?: string | null
          created_at?: string
          drawing_path?: string | null
          entry_type: string
          id?: string
          journal_area?: string | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          audio_path?: string | null
          content?: string | null
          created_at?: string
          drawing_path?: string | null
          entry_type?: string
          id?: string
          journal_area?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_data: {
        Row: {
          created_at: string
          id: string
          mood: Database["public"]["Enums"]["mood_type"]
          notes: string | null
          tags: string[] | null
          time_of_day: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: Database["public"]["Enums"]["mood_type"]
          notes?: string | null
          tags?: string[] | null
          time_of_day?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"]
          notes?: string | null
          tags?: string[] | null
          time_of_day?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_jar_table: {
        Row: {
          created_at: string
          id: string
          image_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_jar_table_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string
          email: string
          guardian1_name: string | null
          guardian1_phone: string | null
          guardian2_name: string | null
          guardian2_phone: string | null
          id: string
          name: string
          password: string
          updated_at: string
          user_phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          guardian1_name?: string | null
          guardian1_phone?: string | null
          guardian2_name?: string | null
          guardian2_phone?: string | null
          id?: string
          name: string
          password: string
          updated_at?: string
          user_phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          guardian1_name?: string | null
          guardian1_phone?: string | null
          guardian2_name?: string | null
          guardian2_phone?: string | null
          id?: string
          name?: string
          password?: string
          updated_at?: string
          user_phone?: string | null
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
      mood_type:
        | "Angry"
        | "Calm"
        | "Sad"
        | "Anxious"
        | "Happy"
        | "Excited"
        | "Overwhelmed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mood_type: [
        "Angry",
        "Calm",
        "Sad",
        "Anxious",
        "Happy",
        "Excited",
        "Overwhelmed",
      ],
    },
  },
} as const
