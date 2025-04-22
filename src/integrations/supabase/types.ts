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
      fork_in_road_decisions: {
        Row: {
          challenges_a: string | null
          challenges_b: string | null
          change_a: string | null
          change_b: string | null
          choice: string | null
          consideration_path: string | null
          created_at: string
          decision_id: string
          feel_a: string | null
          feel_b: string | null
          future_a: string | null
          future_b: string | null
          gain_a: string | null
          gain_b: string | null
          other_path: string | null
          selection: string | null
          strengths_a: string[] | null
          strengths_b: string[] | null
          tag_a: string[] | null
          tag_b: string[] | null
          updated_at: string
          user_id: string
          values_a: string | null
          values_b: string | null
        }
        Insert: {
          challenges_a?: string | null
          challenges_b?: string | null
          change_a?: string | null
          change_b?: string | null
          choice?: string | null
          consideration_path?: string | null
          created_at?: string
          decision_id?: string
          feel_a?: string | null
          feel_b?: string | null
          future_a?: string | null
          future_b?: string | null
          gain_a?: string | null
          gain_b?: string | null
          other_path?: string | null
          selection?: string | null
          strengths_a?: string[] | null
          strengths_b?: string[] | null
          tag_a?: string[] | null
          tag_b?: string[] | null
          updated_at?: string
          user_id: string
          values_a?: string | null
          values_b?: string | null
        }
        Update: {
          challenges_a?: string | null
          challenges_b?: string | null
          change_a?: string | null
          change_b?: string | null
          choice?: string | null
          consideration_path?: string | null
          created_at?: string
          decision_id?: string
          feel_a?: string | null
          feel_b?: string | null
          future_a?: string | null
          future_b?: string | null
          gain_a?: string | null
          gain_b?: string | null
          other_path?: string | null
          selection?: string | null
          strengths_a?: string[] | null
          strengths_b?: string[] | null
          tag_a?: string[] | null
          tag_b?: string[] | null
          updated_at?: string
          user_id?: string
          values_a?: string | null
          values_b?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fork_in_road_decisions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      grounding_responses: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          response_audio_path: string | null
          response_drawing_path: string | null
          response_selected_items: string[] | null
          response_text: string | null
          section_name: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          response_audio_path?: string | null
          response_drawing_path?: string | null
          response_selected_items?: string[] | null
          response_text?: string | null
          section_name: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          response_audio_path?: string | null
          response_drawing_path?: string | null
          response_selected_items?: string[] | null
          response_text?: string | null
          section_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grounding_responses_user_id_fkey"
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
      simple_hi_challenges: {
        Row: {
          challenge_level: string
          created_at: string
          feeling: string | null
          feeling_path: string | null
          feeling_stickers: string | null
          goal: string
          how_it_went: string | null
          how_it_went_path: string | null
          how_it_went_rating: number | null
          how_it_went_stickers: string | null
          id: string
          other_people_rating: number | null
          other_people_responses: string | null
          try_next_time: string | null
          try_next_time_confidence: number | null
          updated_at: string
          user_id: string
          what_felt_easy: string | null
          what_felt_easy_rating: number | null
          what_felt_hard: string | null
          what_felt_hard_rating: number | null
          who: string | null
          who_difficulty: number | null
          who_path: string | null
          who_stickers: string | null
        }
        Insert: {
          challenge_level: string
          created_at?: string
          feeling?: string | null
          feeling_path?: string | null
          feeling_stickers?: string | null
          goal: string
          how_it_went?: string | null
          how_it_went_path?: string | null
          how_it_went_rating?: number | null
          how_it_went_stickers?: string | null
          id?: string
          other_people_rating?: number | null
          other_people_responses?: string | null
          try_next_time?: string | null
          try_next_time_confidence?: number | null
          updated_at?: string
          user_id: string
          what_felt_easy?: string | null
          what_felt_easy_rating?: number | null
          what_felt_hard?: string | null
          what_felt_hard_rating?: number | null
          who?: string | null
          who_difficulty?: number | null
          who_path?: string | null
          who_stickers?: string | null
        }
        Update: {
          challenge_level?: string
          created_at?: string
          feeling?: string | null
          feeling_path?: string | null
          feeling_stickers?: string | null
          goal?: string
          how_it_went?: string | null
          how_it_went_path?: string | null
          how_it_went_rating?: number | null
          how_it_went_stickers?: string | null
          id?: string
          other_people_rating?: number | null
          other_people_responses?: string | null
          try_next_time?: string | null
          try_next_time_confidence?: number | null
          updated_at?: string
          user_id?: string
          what_felt_easy?: string | null
          what_felt_easy_rating?: number | null
          what_felt_hard?: string | null
          what_felt_hard_rating?: number | null
          who?: string | null
          who_difficulty?: number | null
          who_path?: string | null
          who_stickers?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simple_hi_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      simple_hi_interactions: {
        Row: {
          challenge_id: string
          completed_at: string
          feeling: string | null
          feeling_path: string | null
          how_it_went: string | null
          how_it_went_path: string | null
          id: string
          user_id: string
          who: string | null
          who_path: string | null
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          feeling?: string | null
          feeling_path?: string | null
          how_it_went?: string | null
          how_it_went_path?: string | null
          id?: string
          user_id: string
          who?: string | null
          who_path?: string | null
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          feeling?: string | null
          feeling_path?: string | null
          how_it_went?: string | null
          how_it_went_path?: string | null
          id?: string
          user_id?: string
          who?: string | null
          who_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simple_hi_interactions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "simple_hi_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simple_hi_interactions_user_id_fkey"
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
          user_type: number
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
          user_type?: number
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
          user_type?: number
        }
        Relationships: []
      }
    }
    Views: {
      user_decisions: {
        Row: {
          challenges_a: string | null
          challenges_b: string | null
          change_a: string | null
          change_b: string | null
          choice: string | null
          consideration_path: string | null
          created_at: string | null
          decision_id: string | null
          feel_a: string | null
          feel_b: string | null
          future_a: string | null
          future_b: string | null
          gain_a: string | null
          gain_b: string | null
          other_path: string | null
          selection: string | null
          strengths_a: string[] | null
          strengths_b: string[] | null
          tag_a: string[] | null
          tag_b: string[] | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          values_a: string | null
          values_b: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fork_in_road_decisions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
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
