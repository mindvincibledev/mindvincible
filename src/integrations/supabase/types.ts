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
        Relationships: []
      }
      battery_boost_entries: {
        Row: {
          accounts_to_follow_more: string | null
          accounts_to_unfollow: string | null
          bonus_completed: boolean | null
          boost_topics: string[] | null
          created_at: string
          drain_patterns: string | null
          feeling_after_scroll: string | null
          final_percentage: number | null
          id: string
          next_scroll_strategy: string | null
          selected_vibes: string[] | null
          shared_post_description: string | null
          shared_post_impact: string | null
          starting_percentage: number
          updated_at: string
          user_id: string
          visible_to_clinicians: boolean
        }
        Insert: {
          accounts_to_follow_more?: string | null
          accounts_to_unfollow?: string | null
          bonus_completed?: boolean | null
          boost_topics?: string[] | null
          created_at?: string
          drain_patterns?: string | null
          feeling_after_scroll?: string | null
          final_percentage?: number | null
          id?: string
          next_scroll_strategy?: string | null
          selected_vibes?: string[] | null
          shared_post_description?: string | null
          shared_post_impact?: string | null
          starting_percentage?: number
          updated_at?: string
          user_id: string
          visible_to_clinicians?: boolean
        }
        Update: {
          accounts_to_follow_more?: string | null
          accounts_to_unfollow?: string | null
          bonus_completed?: boolean | null
          boost_topics?: string[] | null
          created_at?: string
          drain_patterns?: string | null
          feeling_after_scroll?: string | null
          final_percentage?: number | null
          id?: string
          next_scroll_strategy?: string | null
          selected_vibes?: string[] | null
          shared_post_description?: string | null
          shared_post_impact?: string | null
          starting_percentage?: number
          updated_at?: string
          user_id?: string
          visible_to_clinicians?: boolean
        }
        Relationships: []
      }
      battery_boost_posts: {
        Row: {
          created_at: string
          entry_id: string
          id: string
          notes: string | null
          percentage_change: number
          post_category: string | null
          post_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          id?: string
          notes?: string | null
          percentage_change: number
          post_category?: string | null
          post_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          id?: string
          notes?: string | null
          percentage_change?: number
          post_category?: string | null
          post_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battery_boost_posts_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "battery_boost_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      check_in_requests: {
        Row: {
          alert_sent: boolean
          created_at: string
          id: string
          notes: string | null
          resolved: boolean
          resolved_at: string | null
          user_id: string
        }
        Insert: {
          alert_sent?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          resolved?: boolean
          resolved_at?: string | null
          user_id: string
        }
        Update: {
          alert_sent?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          resolved?: boolean
          resolved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      confidence_tree_reflections: {
        Row: {
          created_at: string | null
          id: string
          prompt: string
          reflection_text: string
          tree_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt: string
          reflection_text: string
          tree_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt?: string
          reflection_text?: string
          tree_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "confidence_tree_reflections_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "confidence_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      confidence_trees: {
        Row: {
          branches: Json
          created_at: string | null
          id: string
          is_shared: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branches?: Json
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branches?: Json
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          visibility: boolean
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
          visibility?: boolean
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
          visibility?: boolean
        }
        Relationships: []
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
          visibility: boolean
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
          visibility?: boolean
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
          visibility?: boolean
        }
        Relationships: []
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
          visibility: boolean
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
          visibility?: boolean
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
          visibility?: boolean
        }
        Relationships: []
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
          visibility: boolean
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
          visibility?: boolean
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
          visibility?: boolean
        }
        Relationships: []
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
        Relationships: []
      }
      mood_jar_table: {
        Row: {
          created_at: string
          id: string
          image_path: string
          user_id: string
          visibility: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          user_id?: string
          visibility?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          user_id?: string
          visibility?: boolean
        }
        Relationships: []
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
          visibility: boolean
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
          visibility?: boolean
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
          visibility?: boolean
          what_felt_easy?: string | null
          what_felt_easy_rating?: number | null
          what_felt_hard?: string | null
          what_felt_hard_rating?: number | null
          who?: string | null
          who_difficulty?: number | null
          who_path?: string | null
          who_stickers?: string | null
        }
        Relationships: []
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
          name: string | null
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
          name?: string | null
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
          name?: string | null
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
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_or_clinician: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_clinician: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_visible_to_clinician: {
        Args: { visibility: boolean; owner_id: string }
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
