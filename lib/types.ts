export type PredictionStatus =
  | "draft"
  | "saved"
  | "locked"
  | "hidden"
  | "live"
  | "scored";

export type Team = {
  id: string;
  name: string;
  flag: string;
  fifaRank: number;
  group: string;
};

export type User = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  label: string;
  roast?: string;
  isAdmin?: boolean;
  points: {
    total: number;
    groupMatches: number;
    groupStandings: number;
    knockout: number;
    bonus: number;
    last: number;
  };
};

export type Match = {
  id: string;
  group?: string;
  date: string;
  deadline: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  status: PredictionStatus;
  prediction?: [number, number];
  result?: [number, number];
  friendsVisible: boolean;
};

export type GroupStandingPrediction = {
  group: string;
  groupId: string;
  status: PredictionStatus;
  deadline: string;
  teams: Team[];
};

// One row of a live, Flashscore-style group table computed from real results.
export type GroupTableRow = {
  teamId: string;
  name: string;
  flag: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isBestThird: boolean;
};

export type GroupTable = {
  group: string;
  groupId: string;
  status: PredictionStatus;
  deadline: string;
  standings: GroupTableRow[];
  // The player's predicted order (team ids, position 1..4), or null if not set.
  prediction: { teamId: string; name: string; flag: string }[] | null;
  // Points this prediction would earn if the group stage ended right now.
  simulatedPoints: number | null;
};

export type KnockoutMatch = {
  id: string;
  round: string;
  date: string;
  teamA: string;
  teamB: string;
  flagA?: string;
  flagB?: string;
  status: PredictionStatus;
  prediction?: [number, number];
  result?: [number, number];
  winner?: string;
  friendsVisible: boolean;
};
