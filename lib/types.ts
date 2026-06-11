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

export type KnockoutMatch = {
  id: string;
  round: string;
  date: string;
  teamA: string;
  teamB: string;
  status: PredictionStatus;
  prediction?: [number, number];
  winner?: string;
  friendsVisible: boolean;
};
