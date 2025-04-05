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
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          user_id?: string
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
