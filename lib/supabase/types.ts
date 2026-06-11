export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string;
          avatar_initials: string;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string;
          avatar_initials?: string;
          is_admin?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      leagues: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          invite_code: string;
          is_private?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["leagues"]["Insert"]>;
      };
      league_members: {
        Row: {
          id: string;
          league_id: string;
          user_id: string;
          role: "admin" | "member";
          joined_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          user_id: string;
          role?: "admin" | "member";
        };
        Update: Partial<Database["public"]["Tables"]["league_members"]["Insert"]>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          flag_code: string;
          fifa_rank: number | null;
          group_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          flag_code: string;
          fifa_rank?: number | null;
          group_code?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
      };
      world_cup_groups: {
        Row: {
          id: string;
          code: string;
          standings_deadline: string;
          status: "editable" | "saved" | "locked" | "scored";
        };
        Insert: {
          id?: string;
          code: string;
          standings_deadline: string;
          status?: "editable" | "saved" | "locked" | "scored";
        };
        Update: Partial<Database["public"]["Tables"]["world_cup_groups"]["Insert"]>;
      };
      fixtures: {
        Row: {
          id: string;
          external_id: string | null;
          league_id: string;
          stage: "group" | "knockout";
          round: string | null;
          group_code: string | null;
          team_a_id: string | null;
          team_b_id: string | null;
          placeholder_a: string | null;
          placeholder_b: string | null;
          starts_at: string;
          status: "draft" | "scheduled" | "locked" | "live" | "finished";
          score_a: number | null;
          score_b: number | null;
          winner_team_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          external_id?: string | null;
          league_id: string;
          stage: "group" | "knockout";
          round?: string | null;
          group_code?: string | null;
          team_a_id?: string | null;
          team_b_id?: string | null;
          placeholder_a?: string | null;
          placeholder_b?: string | null;
          starts_at: string;
          status?: "draft" | "scheduled" | "locked" | "live" | "finished";
          score_a?: number | null;
          score_b?: number | null;
          winner_team_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["fixtures"]["Insert"]>;
      };
      match_predictions: {
        Row: {
          id: string;
          fixture_id: string;
          user_id: string;
          score_a: number;
          score_b: number;
          winner_team_id: string | null;
          status: "draft" | "saved" | "locked" | "hidden" | "live" | "scored";
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fixture_id: string;
          user_id: string;
          score_a: number;
          score_b: number;
          winner_team_id?: string | null;
          status?: "draft" | "saved" | "locked" | "hidden" | "live" | "scored";
          points?: number;
        };
        Update: Partial<Database["public"]["Tables"]["match_predictions"]["Insert"]>;
      };
      group_standing_predictions: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          status: "draft" | "saved" | "locked" | "hidden" | "live" | "scored";
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          status?: "draft" | "saved" | "locked" | "hidden" | "live" | "scored";
          points?: number;
        };
        Update: Partial<Database["public"]["Tables"]["group_standing_predictions"]["Insert"]>;
      };
      group_standing_prediction_items: {
        Row: {
          id: string;
          prediction_id: string;
          team_id: string;
          predicted_position: number;
          points: number;
        };
        Insert: {
          id?: string;
          prediction_id: string;
          team_id: string;
          predicted_position: number;
          points?: number;
        };
        Update: Partial<Database["public"]["Tables"]["group_standing_prediction_items"]["Insert"]>;
      };
      points_events: {
        Row: {
          id: string;
          user_id: string;
          league_id: string;
          source_type: "match" | "group" | "knockout" | "bonus" | "admin";
          source_id: string | null;
          label: string;
          points: number;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          league_id: string;
          source_type: "match" | "group" | "knockout" | "bonus" | "admin";
          source_id?: string | null;
          label: string;
          points: number;
          meta?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["points_events"]["Insert"]>;
      };
      sync_logs: {
        Row: {
          id: string;
          job: string;
          status: "success" | "warning" | "error";
          detail: string;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          job: string;
          status: "success" | "warning" | "error";
          detail: string;
          meta?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["sync_logs"]["Insert"]>;
      };
    };
    Views: {
      leaderboard: {
        Row: {
          league_id: string;
          user_id: string;
          display_name: string;
          avatar_initials: string;
          total_points: number;
          group_match_points: number;
          group_standings_points: number;
          knockout_points: number;
          bonus_points: number;
          last_points_gained: number;
        };
      };
    };
    Functions: {
      join_league_by_code: {
        Args: { code: string };
        Returns: string;
      };
      recalculate_league_points: {
        Args: { target_league_id: string };
        Returns: number;
      };
    };
  };
};
