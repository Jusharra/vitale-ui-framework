export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          feedback_type: string
          id: string
          is_helpful: boolean
          provider_id: string | null
          submission_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          feedback_type: string
          id?: string
          is_helpful: boolean
          provider_id?: string | null
          submission_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          is_helpful?: boolean
          provider_id?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "symptom_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          partner_id: string | null
          profile_id: string | null
          scheduled_for: string
          service_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          profile_id?: string | null
          scheduled_for: string
          service_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          profile_id?: string | null
          scheduled_for?: string
          service_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      call_reports: {
        Row: {
          ai_agent_id: string
          call_date: string
          call_duration: number
          call_summary: string | null
          created_at: string | null
          follow_up_notes: string | null
          follow_up_required: boolean
          id: string
          profile_id: string | null
          satisfaction_rating: number
          sentiment_analysis: Json | null
          topics_discussed: string[]
          user_id: string | null
        }
        Insert: {
          ai_agent_id: string
          call_date?: string
          call_duration?: number
          call_summary?: string | null
          created_at?: string | null
          follow_up_notes?: string | null
          follow_up_required?: boolean
          id?: string
          profile_id?: string | null
          satisfaction_rating: number
          sentiment_analysis?: Json | null
          topics_discussed?: string[]
          user_id?: string | null
        }
        Update: {
          ai_agent_id?: string
          call_date?: string
          call_duration?: number
          call_summary?: string | null
          created_at?: string | null
          follow_up_notes?: string | null
          follow_up_required?: boolean
          id?: string
          profile_id?: string | null
          satisfaction_rating?: number
          sentiment_analysis?: Json | null
          topics_discussed?: string[]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_reports_summary: {
        Row: {
          agent_usage: Json
          avg_duration_seconds: number
          avg_satisfaction: number
          created_at: string | null
          follow_ups_needed: number
          id: string
          report_date: string
          topics: string[]
          total_calls: number
        }
        Insert: {
          agent_usage?: Json
          avg_duration_seconds?: number
          avg_satisfaction?: number
          created_at?: string | null
          follow_ups_needed?: number
          id?: string
          report_date: string
          topics?: string[]
          total_calls?: number
        }
        Update: {
          agent_usage?: Json
          avg_duration_seconds?: number
          avg_satisfaction?: number
          created_at?: string | null
          follow_ups_needed?: number
          id?: string
          report_date?: string
          topics?: string[]
          total_calls?: number
        }
        Relationships: []
      }
      care_facilities: {
        Row: {
          amenities: string[] | null
          care_type: string
          created_at: string | null
          description: string | null
          email: string | null
          featured: boolean | null
          hours: string | null
          id: string
          image_url: string | null
          images: string[] | null
          location: string
          name: string
          phone: string | null
          price_range: string
          seo_keywords: string[] | null
          services: string[] | null
          slug: string | null
          spots_available: number | null
          status: string | null
          updated_at: string | null
          videos: string[] | null
          virtual_tour_url: string | null
          website: string | null
        }
        Insert: {
          amenities?: string[] | null
          care_type: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          featured?: boolean | null
          hours?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location: string
          name: string
          phone?: string | null
          price_range: string
          seo_keywords?: string[] | null
          services?: string[] | null
          slug?: string | null
          spots_available?: number | null
          status?: string | null
          updated_at?: string | null
          videos?: string[] | null
          virtual_tour_url?: string | null
          website?: string | null
        }
        Update: {
          amenities?: string[] | null
          care_type?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          featured?: boolean | null
          hours?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string
          name?: string
          phone?: string | null
          price_range?: string
          seo_keywords?: string[] | null
          services?: string[] | null
          slug?: string | null
          spots_available?: number | null
          status?: string | null
          updated_at?: string | null
          videos?: string[] | null
          virtual_tour_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      care_team_members: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          joined_at: string | null
          last_interaction: string | null
          partner_id: string | null
          pharmacy_id: string | null
          profile_id: string | null
          relationship_type: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          joined_at?: string | null
          last_interaction?: string | null
          partner_id?: string | null
          pharmacy_id?: string | null
          profile_id?: string | null
          relationship_type?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          joined_at?: string | null
          last_interaction?: string | null
          partner_id?: string | null
          pharmacy_id?: string | null
          profile_id?: string | null
          relationship_type?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_team_members_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_team_members_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          state: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          state: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          state?: string
        }
        Relationships: []
      }
      facility_tours: {
        Row: {
          created_at: string | null
          email: string
          facility_id: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string
          status: string
          tour_date: string
          tour_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          facility_id?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          status?: string
          tour_date: string
          tour_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          facility_id?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          status?: string
          tour_date?: string
          tour_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_tours_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "care_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      health_assessments: {
        Row: {
          created_at: string | null
          goals: string | null
          history: string | null
          id: string
          mental_health: string | null
          physical_health: string | null
          profile_id: string | null
          symptoms: string | null
        }
        Insert: {
          created_at?: string | null
          goals?: string | null
          history?: string | null
          id?: string
          mental_health?: string | null
          physical_health?: string | null
          profile_id?: string | null
          symptoms?: string | null
        }
        Update: {
          created_at?: string | null
          goals?: string | null
          history?: string | null
          id?: string
          mental_health?: string | null
          physical_health?: string | null
          profile_id?: string | null
          symptoms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          created_at: string | null
          id: string
          measured_at: string | null
          metric_type: string | null
          notes: string | null
          profile_id: string | null
          unit: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          measured_at?: string | null
          metric_type?: string | null
          notes?: string | null
          profile_id?: string | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          measured_at?: string | null
          metric_type?: string | null
          notes?: string | null
          profile_id?: string | null
          unit?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          lead_id: string | null
          partner_id: string | null
          profile_id: string | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          lead_id?: string | null
          partner_id?: string | null
          profile_id?: string | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          lead_id?: string | null
          partner_id?: string | null
          profile_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_interactions: {
        Row: {
          content: Json | null
          created_at: string | null
          engagement_score: number | null
          id: string
          interaction_type: string
          lead_id: string | null
          profile_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interaction_type: string
          lead_id?: string | null
          profile_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interaction_type?: string
          lead_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_interactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          health_interests: string[] | null
          id: string
          last_contact: string | null
          last_name: string | null
          lead_score: number | null
          next_contact: string | null
          notes: string | null
          phone: string | null
          profile_id: string | null
          risk_factors: Json | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          health_interests?: string[] | null
          id?: string
          last_contact?: string | null
          last_name?: string | null
          lead_score?: number | null
          next_contact?: string | null
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          risk_factors?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          health_interests?: string[] | null
          id?: string
          last_contact?: string | null
          last_name?: string | null
          lead_score?: number | null
          next_contact?: string | null
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          risk_factors?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string | null
          id: string
          metadata: Json | null
          record_id: string | null
          table_name: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          id?: string
          metadata?: Json | null
          record_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          id?: string
          metadata?: Json | null
          record_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      media_asset_permissions: {
        Row: {
          asset_id: string
          created_at: string | null
          id: string
          permission_type: string
          shared_with: string | null
          updated_at: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          id?: string
          permission_type: string
          shared_with?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          id?: string
          permission_type?: string
          shared_with?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_asset_permissions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_asset_permissions_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          asset_type: string
          category: string
          created_at: string | null
          description: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_master: boolean | null
          is_source: boolean | null
          metadata: Json | null
          original_filename: string
          parent_id: string | null
          profile_id: string | null
          storage_type: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          asset_type: string
          category: string
          created_at?: string | null
          description?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_master?: boolean | null
          is_source?: boolean | null
          metadata?: Json | null
          original_filename: string
          parent_id?: string | null
          profile_id?: string | null
          storage_type?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          asset_type?: string
          category?: string
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_master?: boolean | null
          is_source?: boolean | null
          metadata?: Json | null
          original_filename?: string
          parent_id?: string | null
          profile_id?: string | null
          storage_type?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string
          id: string
          instructions: string
          is_controlled: boolean | null
          last_filled: string | null
          name: string
          profile_id: string | null
          refills_remaining: number | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          id?: string
          instructions: string
          is_controlled?: boolean | null
          last_filled?: string | null
          name: string
          profile_id?: string | null
          refills_remaining?: number | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          id?: string
          instructions?: string
          is_controlled?: boolean | null
          last_filled?: string | null
          name?: string
          profile_id?: string | null
          refills_remaining?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_rewards: {
        Row: {
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          name: string
          profile_id: string | null
          redeemed: boolean | null
          renewal_date: string | null
          reward_type: string
          status: string | null
          terms_conditions: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          profile_id?: string | null
          redeemed?: boolean | null
          renewal_date?: string | null
          reward_type: string
          status?: string | null
          terms_conditions?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          profile_id?: string | null
          redeemed?: boolean | null
          renewal_date?: string | null
          reward_type?: string
          status?: string | null
          terms_conditions?: string | null
          value?: number | null
        }
        Relationships: []
      }
      membership_features: {
        Row: {
          created_at: string | null
          feature_description: string | null
          feature_name: string
          id: string
          is_enabled: boolean | null
          tier: string
        }
        Insert: {
          created_at?: string | null
          feature_description?: string | null
          feature_name: string
          id?: string
          is_enabled?: boolean | null
          tier: string
        }
        Update: {
          created_at?: string | null
          feature_description?: string | null
          feature_name?: string
          id?: string
          is_enabled?: boolean | null
          tier?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          membership_type: string | null
          profile_id: string | null
          start_date: string | null
          status: string | null
          tier: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          membership_type?: string | null
          profile_id?: string | null
          start_date?: string | null
          status?: string | null
          tier?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          membership_type?: string | null
          profile_id?: string | null
          start_date?: string | null
          status?: string | null
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_leads: {
        Row: {
          conversion_date: string | null
          created_at: string | null
          first_contact_date: string | null
          id: string
          last_contact_date: string | null
          metadata: Json | null
          next_follow_up: string | null
          notes: string | null
          partner_id: string | null
          profile_id: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          conversion_date?: string | null
          created_at?: string | null
          first_contact_date?: string | null
          id?: string
          last_contact_date?: string | null
          metadata?: Json | null
          next_follow_up?: string | null
          notes?: string | null
          partner_id?: string | null
          profile_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          conversion_date?: string | null
          created_at?: string | null
          first_contact_date?: string | null
          id?: string
          last_contact_date?: string | null
          metadata?: Json | null
          next_follow_up?: string | null
          notes?: string | null
          partner_id?: string | null
          profile_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_leads_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_offers: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          financing_available: boolean | null
          id: string
          image_url: string | null
          link: string | null
          price: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          financing_available?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          price?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          financing_available?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          price?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          partner_id: string
          payout_date: string | null
          status: string
          stripe_payout_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          partner_id: string
          payout_date?: string | null
          status?: string
          stripe_payout_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          partner_id?: string
          payout_date?: string | null
          status?: string
          stripe_payout_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_platform_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          id: string
          partner_id: string
          status: string
          stripe_subscription_id: string | null
          subscription_start_date: string | null
          trial_end_date: string
          trial_start_date: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          partner_id: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          partner_id?: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_platform_subscriptions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_trials: {
        Row: {
          conversion_date: string | null
          created_at: string | null
          id: string
          partner_id: string
          profile_id: string
          trial_end_date: string
          trial_start_date: string
          trial_status: string
          updated_at: string | null
        }
        Insert: {
          conversion_date?: string | null
          created_at?: string | null
          id?: string
          partner_id: string
          profile_id: string
          trial_end_date?: string
          trial_start_date?: string
          trial_status?: string
          updated_at?: string | null
        }
        Update: {
          conversion_date?: string | null
          created_at?: string | null
          id?: string
          partner_id?: string
          profile_id?: string
          trial_end_date?: string
          trial_start_date?: string
          trial_status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_trials_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_trials_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          accepting_new_patients: boolean | null
          bio: string | null
          connect_onboarding_complete: boolean | null
          consultation_fee: number | null
          created_at: string | null
          credentials: string | null
          doxy_room_url: string | null
          email: string | null
          facebook_url: string | null
          first_name: string | null
          full_revenue_eligible: boolean | null
          hourly_rate: string | null
          id: string
          in_person_consultation: boolean | null
          instagram_url: string | null
          languages: string[] | null
          linkedin_url: string | null
          name: string
          phone: string | null
          platform_subscription_active: boolean | null
          platform_trial_ends_at: string | null
          practice_address: Json | null
          practice_name: string | null
          profile_image: string | null
          rating: number | null
          revenue_split_active: boolean | null
          revenue_split_percentage: number | null
          service_area: string | null
          slug: string | null
          specializations: string[] | null
          specialties: string[] | null
          status: string | null
          stripe_connect_account_id: string | null
          telehealth_enabled: boolean | null
          tiktok_url: string | null
          user_id: string | null
          vacation_mode: boolean | null
          verified: boolean | null
          video_consultation: boolean | null
          virtual_appointment_preferences: Json | null
          youtube_url: string | null
        }
        Insert: {
          accepting_new_patients?: boolean | null
          bio?: string | null
          connect_onboarding_complete?: boolean | null
          consultation_fee?: number | null
          created_at?: string | null
          credentials?: string | null
          doxy_room_url?: string | null
          email?: string | null
          facebook_url?: string | null
          first_name?: string | null
          full_revenue_eligible?: boolean | null
          hourly_rate?: string | null
          id?: string
          in_person_consultation?: boolean | null
          instagram_url?: string | null
          languages?: string[] | null
          linkedin_url?: string | null
          name: string
          phone?: string | null
          platform_subscription_active?: boolean | null
          platform_trial_ends_at?: string | null
          practice_address?: Json | null
          practice_name?: string | null
          profile_image?: string | null
          rating?: number | null
          revenue_split_active?: boolean | null
          revenue_split_percentage?: number | null
          service_area?: string | null
          slug?: string | null
          specializations?: string[] | null
          specialties?: string[] | null
          status?: string | null
          stripe_connect_account_id?: string | null
          telehealth_enabled?: boolean | null
          tiktok_url?: string | null
          user_id?: string | null
          vacation_mode?: boolean | null
          verified?: boolean | null
          video_consultation?: boolean | null
          virtual_appointment_preferences?: Json | null
          youtube_url?: string | null
        }
        Update: {
          accepting_new_patients?: boolean | null
          bio?: string | null
          connect_onboarding_complete?: boolean | null
          consultation_fee?: number | null
          created_at?: string | null
          credentials?: string | null
          doxy_room_url?: string | null
          email?: string | null
          facebook_url?: string | null
          first_name?: string | null
          full_revenue_eligible?: boolean | null
          hourly_rate?: string | null
          id?: string
          in_person_consultation?: boolean | null
          instagram_url?: string | null
          languages?: string[] | null
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          platform_subscription_active?: boolean | null
          platform_trial_ends_at?: string | null
          practice_address?: Json | null
          practice_name?: string | null
          profile_image?: string | null
          rating?: number | null
          revenue_split_active?: boolean | null
          revenue_split_percentage?: number | null
          service_area?: string | null
          slug?: string | null
          specializations?: string[] | null
          specialties?: string[] | null
          status?: string | null
          stripe_connect_account_id?: string | null
          telehealth_enabled?: boolean | null
          tiktok_url?: string | null
          user_id?: string | null
          vacation_mode?: boolean | null
          verified?: boolean | null
          video_consultation?: boolean | null
          virtual_appointment_preferences?: Json | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          payment_method: string | null
          status: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          status: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_tracking: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_type: string
          reference_id: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_type: string
          reference_id?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_type?: string
          reference_id?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          address: string | null
          created_at: string | null
          delivery_available: boolean | null
          delivery_radius: number | null
          email: string | null
          hours: string | null
          id: string
          insurance_accepted: string | null
          name: string
          partner_id: string | null
          phone: string | null
          services: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_radius?: number | null
          email?: string | null
          hours?: string | null
          id?: string
          insurance_accepted?: string | null
          name: string
          partner_id?: string | null
          phone?: string | null
          services?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          delivery_radius?: number | null
          email?: string | null
          hours?: string | null
          id?: string
          insurance_accepted?: string | null
          name?: string
          partner_id?: string | null
          phone?: string | null
          services?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacies_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_requests: {
        Row: {
          care_needs: string
          created_at: string | null
          deposit_amount: number | null
          deposit_paid: boolean | null
          email: string
          email_sent: boolean | null
          facility_id: string | null
          full_name: string
          id: string
          location: string
          notes: string | null
          phone: string
          status: string
          updated_at: string | null
          urgency_level: string
          user_id: string | null
        }
        Insert: {
          care_needs: string
          created_at?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          email: string
          email_sent?: boolean | null
          facility_id?: string | null
          full_name: string
          id?: string
          location: string
          notes?: string | null
          phone: string
          status?: string
          updated_at?: string | null
          urgency_level: string
          user_id?: string | null
        }
        Update: {
          care_needs?: string
          created_at?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          email?: string
          email_sent?: boolean | null
          facility_id?: string | null
          full_name?: string
          id?: string
          location?: string
          notes?: string | null
          phone?: string
          status?: string
          updated_at?: string | null
          urgency_level?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_partner_id: string | null
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          membership_tier: string | null
          phone: string | null
          referral_code: string | null
          referral_reward_earned: boolean | null
          referred_count: number | null
          role: string | null
          status: string | null
          stripe_customer_id: string | null
          trial_end_date: string | null
          trial_status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_partner_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          membership_tier?: string | null
          phone?: string | null
          referral_code?: string | null
          referral_reward_earned?: boolean | null
          referred_count?: number | null
          role?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          trial_end_date?: string | null
          trial_status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_partner_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          membership_tier?: string | null
          phone?: string | null
          referral_code?: string | null
          referral_reward_earned?: boolean | null
          referred_count?: number | null
          role?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          trial_end_date?: string | null
          trial_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_assigned_partner_id_fkey"
            columns: ["assigned_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_claims: {
        Row: {
          claimed_at: string | null
          id: string
          profile_id: string | null
          promotion_id: string | null
          status: string
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          profile_id?: string | null
          promotion_id?: string | null
          status?: string
        }
        Update: {
          claimed_at?: string | null
          id?: string
          profile_id?: string | null
          promotion_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_claims_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_claims_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_performance_metrics: {
        Row: {
          claims: number | null
          conversions: number | null
          created_at: string | null
          date: string
          id: string
          promotion_id: string | null
          revenue_impact: number | null
          views: number | null
        }
        Insert: {
          claims?: number | null
          conversions?: number | null
          created_at?: string | null
          date: string
          id?: string
          promotion_id?: string | null
          revenue_impact?: number | null
          views?: number | null
        }
        Update: {
          claims?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          promotion_id?: string | null
          revenue_impact?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_performance_metrics_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_performance_metrics_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_service_mappings: {
        Row: {
          created_at: string | null
          id: string
          promotion_id: string | null
          service_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          promotion_id?: string | null
          service_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          promotion_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_service_mappings_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_service_mappings_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_service_mappings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_target_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          criteria: Json | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string | null
          description: string | null
          expires_at: string
          id: string
          partner_id: string | null
          redemption_limit: number | null
          redemptions_used: number | null
          reward_amount: number
          service_id: string | null
          status: string
          target_audience: string | null
          terms_conditions: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expires_at: string
          id?: string
          partner_id?: string | null
          redemption_limit?: number | null
          redemptions_used?: number | null
          reward_amount: number
          service_id?: string | null
          status?: string
          target_audience?: string | null
          terms_conditions?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expires_at?: string
          id?: string
          partner_id?: string | null
          redemption_limit?: number | null
          redemptions_used?: number | null
          reward_amount?: number
          service_id?: string | null
          status?: string
          target_audience?: string | null
          terms_conditions?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          partner_id: string | null
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          partner_id?: string | null
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          partner_id?: string | null
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_notes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "symptom_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          partner_id: string | null
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          partner_id?: string | null
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          partner_id?: string | null
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_replies_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "symptom_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount: number | null
          id: string
          product_name: string | null
          profile_id: string | null
          purchased_at: string | null
        }
        Insert: {
          amount?: number | null
          id?: string
          product_name?: string | null
          profile_id?: string | null
          purchased_at?: string | null
        }
        Update: {
          amount?: number | null
          id?: string
          product_name?: string | null
          profile_id?: string | null
          purchased_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          invitee_email: string
          invitee_joined: boolean | null
          inviter_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitee_email: string
          invitee_joined?: boolean | null
          inviter_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitee_email?: string
          invitee_joined?: boolean | null
          inviter_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refill_requests: {
        Row: {
          approved_by: string | null
          delivery_type: string | null
          id: string
          medication_id: string | null
          notes: string | null
          patient_id: string | null
          request_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          delivery_type?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          patient_id?: string | null
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          delivery_type?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          patient_id?: string | null
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refill_requests_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          generated_at: string | null
          generated_by: string | null
          id: string
          report_data: Json | null
          report_type: string | null
        }
        Insert: {
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          report_data?: Json | null
          report_type?: string | null
        }
        Update: {
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          report_data?: Json | null
          report_type?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          county: string | null
          created_at: string | null
          description: string
          documents_needed: string[] | null
          eligibility: string | null
          id: string
          organization: string
          phone: string | null
          state: string
          tags: string[] | null
          title: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category: string
          county?: string | null
          created_at?: string | null
          description: string
          documents_needed?: string[] | null
          eligibility?: string | null
          id?: string
          organization: string
          phone?: string | null
          state: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string
          county?: string | null
          created_at?: string | null
          description?: string
          documents_needed?: string[] | null
          eligibility?: string | null
          id?: string
          organization?: string
          phone?: string | null
          state?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reward_points: {
        Row: {
          created_at: string | null
          current_balance: number | null
          id: string
          last_activity: string | null
          lifetime_earned: number | null
          lifetime_redeemed: number | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_balance?: number | null
          id?: string
          last_activity?: string | null
          lifetime_earned?: number | null
          lifetime_redeemed?: number | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_balance?: number | null
          id?: string
          last_activity?: string | null
          lifetime_earned?: number | null
          lifetime_redeemed?: number | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          id: string
          notes: string | null
          points_used: number
          processed_at: string | null
          processed_by: string | null
          profile_id: string | null
          redeemed_at: string | null
          reward_id: string | null
          status: string
        }
        Insert: {
          id?: string
          notes?: string | null
          points_used: number
          processed_at?: string | null
          processed_by?: string | null
          profile_id?: string | null
          redeemed_at?: string | null
          reward_id?: string | null
          status: string
        }
        Update: {
          id?: string
          notes?: string | null
          points_used?: number
          processed_at?: string | null
          processed_by?: string | null
          profile_id?: string | null
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "member_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_tiers: {
        Row: {
          benefits: Json | null
          created_at: string | null
          id: string
          max_points: number | null
          min_points: number
          multiplier: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          max_points?: number | null
          min_points: number
          multiplier?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          max_points?: number | null
          min_points?: number
          multiplier?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reward_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          points: number
          profile_id: string | null
          reference_id: string | null
          source: string
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          points: number
          profile_id?: string | null
          reference_id?: string | null
          source: string
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          points?: number
          profile_id?: string | null
          reference_id?: string | null
          source?: string
          transaction_type?: string
        }
        Relationships: []
      }
      service_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      submission_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          profile_id: string | null
          submission_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          profile_id?: string | null
          submission_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          profile_id?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "symptom_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          assigned_partner_id: string | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          partner_revenue_amount: number | null
          platform_fee_amount: number | null
          status: string
          stripe_subscription_id: string | null
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_partner_id?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          partner_revenue_amount?: number | null
          platform_fee_amount?: number | null
          status?: string
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_partner_id?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          partner_revenue_amount?: number | null
          platform_fee_amount?: number | null
          status?: string
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_assigned_partner_id_fkey"
            columns: ["assigned_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      symptom_submissions: {
        Row: {
          ai_assessment: string | null
          ai_confidence: number | null
          ai_risk_level: string | null
          assigned_partner_id: string | null
          created_at: string | null
          duration: string | null
          id: string
          notes: string | null
          onset_date: string | null
          profile_id: string | null
          severity: number | null
          status: string
          symptoms: string
          updated_at: string | null
          urgency_flag: string
        }
        Insert: {
          ai_assessment?: string | null
          ai_confidence?: number | null
          ai_risk_level?: string | null
          assigned_partner_id?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          notes?: string | null
          onset_date?: string | null
          profile_id?: string | null
          severity?: number | null
          status?: string
          symptoms: string
          updated_at?: string | null
          urgency_flag?: string
        }
        Update: {
          ai_assessment?: string | null
          ai_confidence?: number | null
          ai_risk_level?: string | null
          assigned_partner_id?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          notes?: string | null
          onset_date?: string | null
          profile_id?: string | null
          severity?: number | null
          status?: string
          symptoms?: string
          updated_at?: string | null
          urgency_flag?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_submissions_assigned_partner_id_fkey"
            columns: ["assigned_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      telehealth_session: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          appointment_id: string | null
          created_at: string | null
          id: string
          member_id: string | null
          notes: string | null
          partner_id: string | null
          scheduled_end: string
          scheduled_start: string
          session_url: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          partner_id?: string | null
          scheduled_end: string
          scheduled_start: string
          session_url: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          partner_id?: string | null
          scheduled_end?: string
          scheduled_start?: string
          session_url?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telehealth_session_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telehealth_session_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_access_levels: {
        Row: {
          created_at: string | null
          id: string
          required_tier: string
          tool_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          required_tier: string
          tool_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          required_tier?: string
          tool_name?: string
        }
        Relationships: []
      }
      tool_access_logs: {
        Row: {
          access_date: string | null
          delivery_method: string | null
          id: string
          pdf_url: string | null
          status: string | null
          tool_name: string | null
          user_id: string | null
        }
        Insert: {
          access_date?: string | null
          delivery_method?: string | null
          id?: string
          pdf_url?: string | null
          status?: string | null
          tool_name?: string | null
          user_id?: string | null
        }
        Update: {
          access_date?: string | null
          delivery_method?: string | null
          id?: string
          pdf_url?: string | null
          status?: string | null
          tool_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tool_submissions: {
        Row: {
          created_at: string | null
          id: string
          submission_data: Json | null
          tool_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          submission_data?: Json | null
          tool_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          submission_data?: Json | null
          tool_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          partner_id: string | null
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          partner_id?: string | null
          status: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          partner_id?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      transports: {
        Row: {
          address: string | null
          available_24_7: boolean | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          insurance_accepted: string | null
          name: string
          phone: string | null
          profile_image: string | null
          rating: number | null
          service_area: string | null
          services: string | null
          status: string | null
          wheelchair_accessible: boolean | null
        }
        Insert: {
          address?: string | null
          available_24_7?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          insurance_accepted?: string | null
          name: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          service_area?: string | null
          services?: string | null
          status?: string | null
          wheelchair_accessible?: boolean | null
        }
        Update: {
          address?: string | null
          available_24_7?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          insurance_accepted?: string | null
          name?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          service_area?: string | null
          services?: string | null
          status?: string | null
          wheelchair_accessible?: boolean | null
        }
        Relationships: []
      }
      triage_activity_logs: {
        Row: {
          action: string
          details: string | null
          id: string
          submission_id: string | null
          timestamp: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          submission_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          submission_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "triage_activity_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "symptom_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      vacation_packages: {
        Row: {
          amenities: string[] | null
          available_dates: Json | null
          booking_link: string | null
          created_at: string | null
          description_full: string | null
          description_short: string
          destination_name: string
          duration: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          package_type: string
          price: number
          region: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          available_dates?: Json | null
          booking_link?: string | null
          created_at?: string | null
          description_full?: string | null
          description_short: string
          destination_name: string
          duration?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          package_type: string
          price: number
          region: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          available_dates?: Json | null
          booking_link?: string | null
          created_at?: string | null
          description_full?: string | null
          description_short?: string
          destination_name?: string
          duration?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          package_type?: string
          price?: number
          region?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vital_signs: {
        Row: {
          blood_pressure: string | null
          created_at: string | null
          heart_rate: number | null
          id: string
          measured_at: string | null
          profile_id: string | null
          temperature: number | null
        }
        Insert: {
          blood_pressure?: string | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          measured_at?: string | null
          profile_id?: string | null
          temperature?: number | null
        }
        Update: {
          blood_pressure?: string | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          measured_at?: string | null
          profile_id?: string | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      lead_funnel_stats: {
        Row: {
          conversion_rate: number | null
          converted_leads: number | null
          lost_leads: number | null
          new_leads: number | null
          nurturing_leads: number | null
          qualified_leads: number | null
          total_leads: number | null
        }
        Relationships: []
      }
      membership_conversion_stats: {
        Row: {
          conversion_rate: number | null
          converted_leads: number | null
          month: string | null
          total_leads: number | null
        }
        Relationships: []
      }
      promotion_performance_summary: {
        Row: {
          approved_claims: number | null
          conversion_rate: number | null
          estimated_revenue_impact: number | null
          expires_at: string | null
          id: string | null
          rejected_claims: number | null
          reward_amount: number | null
          status: string | null
          title: string | null
          total_claims: number | null
          total_reward_value: number | null
          type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_tool_access: {
        Args: { user_id: string; tool_name: string }
        Returns: boolean
      }
      create_care_facilities_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_vip_member: {
        Args: { user_id: string }
        Returns: boolean
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_users_from_auth: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
    Enums: {},
  },
} as const
