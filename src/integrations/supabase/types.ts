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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      allergies: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      cabins: {
        Row: {
          capacity: number | null
          code: string
          deck: string | null
          id: number
          pax_checked: boolean | null
        }
        Insert: {
          capacity?: number | null
          code: string
          deck?: string | null
          id: number
          pax_checked?: boolean | null
        }
        Update: {
          capacity?: number | null
          code?: string
          deck?: string | null
          id?: number
          pax_checked?: boolean | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      control: {
        Row: {
          created_at: string
          id: number
          semana: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          semana?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          semana?: number | null
        }
        Relationships: []
      }
      dining_tables: {
        Row: {
          capacity: number | null
          id: string
          id_restaurant: number | null
          mesaCheck: boolean | null
          table_number: string
        }
        Insert: {
          capacity?: number | null
          id: string
          id_restaurant?: number | null
          mesaCheck?: boolean | null
          table_number: string
        }
        Update: {
          capacity?: number | null
          id?: string
          id_restaurant?: number | null
          mesaCheck?: boolean | null
          table_number?: string
        }
        Relationships: []
      }
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
      flights: {
        Row: {
          code: string
          description: string | null
          id: string
        }
        Insert: {
          code: string
          description?: string | null
          id?: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      optional_excursions: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      pax_checked: {
        Row: {
          cabin: number | null
          id: number
        }
        Insert: {
          cabin?: number | null
          id?: number
        }
        Update: {
          cabin?: number | null
          id?: number
        }
        Relationships: []
      }
      programa_diario: {
        Row: {
          actividad: string | null
          hora: string | null
          id: number
          obs: string | null
          tipo_actividad: string | null
        }
        Insert: {
          actividad?: string | null
          hora?: string | null
          id?: number
          obs?: string | null
          tipo_actividad?: string | null
        }
        Update: {
          actividad?: string | null
          hora?: string | null
          id?: number
          obs?: string | null
          tipo_actividad?: string | null
        }
        Relationships: []
      }
      suitecase_checked: {
        Row: {
          cabin: number | null
          id: number
        }
        Insert: {
          cabin?: number | null
          id?: number
        }
        Update: {
          cabin?: number | null
          id?: number
        }
        Relationships: []
      }
      taxis_checked: {
        Row: {
          cabin: string | null
          created_at: string
          first_name: string | null
          id: number
        }
        Insert: {
          cabin?: string | null
          created_at?: string
          first_name?: string | null
          id?: number
        }
        Update: {
          cabin?: string | null
          created_at?: string
          first_name?: string | null
          id?: number
        }
        Relationships: []
      }
      tourists: {
        Row: {
          agencia: string | null
          allergyCheck: boolean | null
          arrival_check: boolean
          beverage_package_check: boolean | null
          birthday: string | null
          cabin_id: number | null
          center_vienna: boolean
          city_id: string | null
          created_at: string | null
          excursionCheck: boolean | null
          first_name: string
          flight_id: string | null
          group_id: string | null
          id: string
          last_name: string
          locator: number | null
          luggage_check: boolean
          observations: string | null
          phone: string | null
          table_check: boolean | null
          table_id: string | null
          taxi_needed: boolean
          title: string | null
          updated_at: string | null
        }
        Insert: {
          agencia?: string | null
          allergyCheck?: boolean | null
          arrival_check?: boolean
          beverage_package_check?: boolean | null
          birthday?: string | null
          cabin_id?: number | null
          center_vienna?: boolean
          city_id?: string | null
          created_at?: string | null
          excursionCheck?: boolean | null
          first_name: string
          flight_id?: string | null
          group_id?: string | null
          id?: string
          last_name: string
          locator?: number | null
          luggage_check?: boolean
          observations?: string | null
          phone?: string | null
          table_check?: boolean | null
          table_id?: string | null
          taxi_needed?: boolean
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          agencia?: string | null
          allergyCheck?: boolean | null
          arrival_check?: boolean
          beverage_package_check?: boolean | null
          birthday?: string | null
          cabin_id?: number | null
          center_vienna?: boolean
          city_id?: string | null
          created_at?: string | null
          excursionCheck?: boolean | null
          first_name?: string
          flight_id?: string | null
          group_id?: string | null
          id?: string
          last_name?: string
          locator?: number | null
          luggage_check?: boolean
          observations?: string | null
          phone?: string | null
          table_check?: boolean | null
          table_id?: string | null
          taxi_needed?: boolean
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tourists_cities"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tourists_flights"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tourists_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabin_table"
            referencedColumns: ["cabin_id"]
          },
          {
            foreignKeyName: "tourists_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tourists_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      tourists_allergies: {
        Row: {
          allergy_id: string
          id: string
          tourist_id: string
        }
        Insert: {
          allergy_id: string
          id?: string
          tourist_id: string
        }
        Update: {
          allergy_id?: string
          id?: string
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tourists_allergies_allergy"
            columns: ["allergy_id"]
            isOneToOne: false
            referencedRelation: "allergies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tourists_allergies_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "cabin_excursion_view"
            referencedColumns: ["tourist_id"]
          },
          {
            foreignKeyName: "fk_tourists_allergies_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "cabinname"
            referencedColumns: ["touristid"]
          },
          {
            foreignKeyName: "fk_tourists_allergies_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["turista_id"]
          },
          {
            foreignKeyName: "fk_tourists_allergies_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourists"
            referencedColumns: ["id"]
          },
        ]
      }
      tourists_excursions: {
        Row: {
          excursion_id: string
          id: string
          status: Database["public"]["Enums"]["excursion_status"] | null
          tourist_id: string
        }
        Insert: {
          excursion_id: string
          id?: string
          status?: Database["public"]["Enums"]["excursion_status"] | null
          tourist_id: string
        }
        Update: {
          excursion_id?: string
          id?: string
          status?: Database["public"]["Enums"]["excursion_status"] | null
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tourists_excursions_excursion"
            columns: ["excursion_id"]
            isOneToOne: false
            referencedRelation: "optional_excursions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tourists_excursions_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "cabin_excursion_view"
            referencedColumns: ["tourist_id"]
          },
          {
            foreignKeyName: "fk_tourists_excursions_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "cabinname"
            referencedColumns: ["touristid"]
          },
          {
            foreignKeyName: "fk_tourists_excursions_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["turista_id"]
          },
          {
            foreignKeyName: "fk_tourists_excursions_tourist"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourists"
            referencedColumns: ["id"]
          },
        ]
      }
      tourists_table: {
        Row: {
          id: string
          table_id: string | null
          tourist_id: string | null
        }
        Insert: {
          id?: string
          table_id?: string | null
          tourist_id?: string | null
        }
        Update: {
          id?: string
          table_id?: string | null
          tourist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tourists_table_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "dining_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tourists_table_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: true
            referencedRelation: "cabin_excursion_view"
            referencedColumns: ["tourist_id"]
          },
          {
            foreignKeyName: "tourists_table_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: true
            referencedRelation: "cabinname"
            referencedColumns: ["touristid"]
          },
          {
            foreignKeyName: "tourists_table_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["turista_id"]
          },
          {
            foreignKeyName: "tourists_table_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: true
            referencedRelation: "tourists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cabin_check: {
        Row: {
          cabina: string | null
          mesa: string | null
        }
        Relationships: []
      }
      cabin_excursion_view: {
        Row: {
          estado_excursion:
            | Database["public"]["Enums"]["excursion_status"]
            | null
          excursion_check: boolean | null
          excursion_elegida: string | null
          nombre_turista: string | null
          numero_cabina: string | null
          tourist_id: string | null
        }
        Relationships: []
      }
      cabin_table: {
        Row: {
          cabin: string | null
          cabin_id: number | null
          groupid: string | null
          locator: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tourists_group_id_fkey"
            columns: ["groupid"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      cabinname: {
        Row: {
          allergyCheck: boolean | null
          cabinname: string | null
          center_vienna: boolean | null
          excursionCheck: boolean | null
          first_name: string | null
          groupid: string | null
          last_name: string | null
          locator: number | null
          table_check: boolean | null
          table_id: string | null
          taxi_needed: boolean | null
          touristid: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tourists_group_id_fkey"
            columns: ["groupid"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      nombreymesa: {
        Row: {
          first_name: string | null
          last_name: string | null
          numeromesa: string | null
        }
        Relationships: []
      }
      restaurant: {
        Row: {
          alergia: boolean | null
          cabina: string | null
          mesa: string | null
          nombre_turista: string | null
          paquete_de_bebidas: boolean | null
          turista_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      excursion_status: "Reservada" | "Pagada" | "Cancelada" | "check"
      guest_title: "Mr" | "Mrs" | "Child" | "Baby"
    }
    CompositeTypes: {
      [_ in never]: never
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
      excursion_status: ["Reservada", "Pagada", "Cancelada", "check"],
      guest_title: ["Mr", "Mrs", "Child", "Baby"],
    },
  },
} as const
