import {
  Beer,
  CircleDot,
  Crown,
  Medal,
  Shield,
  Trophy
} from "lucide-react";
import { GROUP_STANDINGS_DEADLINE_LABEL } from "@/lib/rules";

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

export const league = {
  appName: "Gwardia Piwo World Cup 2026",
  name: "Gwardia Piwo",
  inviteCode: "GWARDIA-PIWO-2026",
  subtitle: "Typuj mecze, ustawiaj grupy i walcz o wieczną chwałę."
};

export const users: User[] = [
  {
    id: "u1",
    name: "Marek Kowal",
    handle: "@marek",
    avatar: "MK",
    label: "Lider Gwardii",
    isAdmin: true,
    points: { total: 142, groupMatches: 68, groupStandings: 30, knockout: 34, bonus: 10, last: 8 }
  },
  {
    id: "u2",
    name: "Ania Zielinska",
    handle: "@ania",
    avatar: "AZ",
    label: "Pretendent",
    points: { total: 136, groupMatches: 64, groupStandings: 28, knockout: 36, bonus: 8, last: 5 }
  },
  {
    id: "u3",
    name: "Kuba Nowak",
    handle: "@kuba",
    avatar: "KN",
    label: "Pretendent",
    points: { total: 128, groupMatches: 59, groupStandings: 31, knockout: 30, bonus: 8, last: 11 }
  },
  {
    id: "u4",
    name: "Ola Wrona",
    handle: "@ola",
    avatar: "OW",
    label: "Solidny Typiarz",
    points: { total: 119, groupMatches: 56, groupStandings: 25, knockout: 32, bonus: 6, last: 3 }
  },
  {
    id: "u5",
    name: "Tomek Beer",
    handle: "@tomek",
    avatar: "TB",
    label: "Solidny Typiarz",
    points: { total: 111, groupMatches: 54, groupStandings: 22, knockout: 29, bonus: 6, last: 0 }
  },
  {
    id: "u6",
    name: "Pawel Lis",
    handle: "@pawel",
    avatar: "PL",
    label: "Solidny Typiarz",
    points: { total: 104, groupMatches: 50, groupStandings: 20, knockout: 28, bonus: 6, last: 4 }
  },
  {
    id: "u7",
    name: "Basia Krol",
    handle: "@basia",
    avatar: "BK",
    label: "Turysta",
    points: { total: 96, groupMatches: 47, groupStandings: 18, knockout: 25, bonus: 6, last: 2 }
  },
  {
    id: "u8",
    name: "Janek Maj",
    handle: "@janek",
    avatar: "JM",
    label: "Turysta",
    points: { total: 84, groupMatches: 40, groupStandings: 17, knockout: 21, bonus: 6, last: 1 }
  }
];

const groupNames = Array.from({ length: 12 }, (_, index) =>
  String.fromCharCode("A".charCodeAt(0) + index)
);

const teamNames = [
  ["United States", "Germany", "Ghana", "New Zealand"],
  ["Canada", "Uruguay", "Japan", "Scotland"],
  ["Mexico", "Netherlands", "Egypt", "South Korea"],
  ["Argentina", "Denmark", "Nigeria", "Panama"],
  ["Brazil", "Croatia", "Morocco", "Qatar"],
  ["France", "Colombia", "Senegal", "Honduras"],
  ["England", "Switzerland", "Cameroon", "Saudi Arabia"],
  ["Spain", "Poland", "Australia", "Costa Rica"],
  ["Portugal", "Serbia", "Tunisia", "Jamaica"],
  ["Italy", "Chile", "Iran", "South Africa"],
  ["Belgium", "Turkey", "Ecuador", "Iceland"],
  ["Norway", "Austria", "Paraguay", "UAE"]
];

const flags = [
  ["US", "DE", "GH", "NZ"],
  ["CA", "UY", "JP", "SC"],
  ["MX", "NL", "EG", "KR"],
  ["AR", "DK", "NG", "PA"],
  ["BR", "HR", "MA", "QA"],
  ["FR", "CO", "SN", "HN"],
  ["EN", "CH", "CM", "SA"],
  ["ES", "PL", "AU", "CR"],
  ["PT", "RS", "TN", "JM"],
  ["IT", "CL", "IR", "ZA"],
  ["BE", "TR", "EC", "IS"],
  ["NO", "AT", "PY", "AE"]
];

export const groups: GroupStandingPrediction[] = groupNames.map((group, groupIndex) => ({
  group,
  status: groupIndex < 5 ? "saved" : "draft",
  deadline: GROUP_STANDINGS_DEADLINE_LABEL,
  teams: teamNames[groupIndex].map((name, teamIndex) => ({
    id: `${group}-${teamIndex + 1}`,
    name,
    flag: flags[groupIndex][teamIndex],
    fifaRank: 3 + groupIndex * 4 + teamIndex,
    group
  }))
}));

export const teams: Team[] = groups.flatMap((group) => group.teams);

export const groupMatches: Match[] = groups.flatMap((group, groupIndex) => {
  const [a, b, c, d] = group.teams;
  const fixtures = [
    [a, b],
    [c, d],
    [a, c],
    [b, d]
  ] as const;

  return fixtures.map(([teamA, teamB], matchIndex) => {
    const sequence = groupIndex * 4 + matchIndex;
    const status: PredictionStatus =
      sequence < 5 ? "scored" : sequence < 9 ? "live" : sequence < 16 ? "locked" : sequence < 28 ? "saved" : "draft";

    return {
      id: `gm-${group.group}-${matchIndex + 1}`,
      group: group.group,
      date: `2026-06-${String(11 + Math.floor(sequence / 3)).padStart(2, "0")} ${matchIndex % 2 ? "21:00" : "18:00"}`,
      deadline: `2026-06-${String(11 + Math.floor(sequence / 3)).padStart(2, "0")} ${matchIndex % 2 ? "20:50" : "17:50"}`,
      teamA: teamA.name,
      teamB: teamB.name,
      flagA: teamA.flag,
      flagB: teamB.flag,
      status,
      prediction: status === "draft" ? undefined : [matchIndex % 3, (groupIndex + matchIndex) % 3],
      result: status === "scored" ? [(groupIndex + 1) % 4, matchIndex % 3] : undefined,
      friendsVisible: ["locked", "live", "scored"].includes(status)
    };
  });
});

export const knockoutMatches: KnockoutMatch[] = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Third-place match",
  "Final"
].flatMap((round, roundIndex) => {
  const matchCount = [8, 4, 4, 2, 1, 1][roundIndex];
  return Array.from({ length: matchCount }, (_, index) => {
    const status: PredictionStatus = roundIndex === 0 && index < 3 ? "saved" : roundIndex === 0 ? "draft" : "hidden";
    return {
      id: `ko-${roundIndex}-${index}`,
      round,
      date: `2026-07-${String(1 + roundIndex * 3 + index).padStart(2, "0")} 20:00`,
      teamA: roundIndex === 0 ? `Winner Group ${groupNames[index]}` : `Winner ${roundIndex}.${index + 1}`,
      teamB: roundIndex === 0 ? `Runner-up Group ${groupNames[11 - index]}` : `Winner ${roundIndex}.${index + 5}`,
      status,
      prediction: status === "saved" ? [2, 1] : undefined,
      winner: status === "saved" ? `Winner Group ${groupNames[index]}` : undefined,
      friendsVisible: false
    };
  });
});

export const friendsPredictions = users.map((user, index) => ({
  user,
  score: [index % 4, (index + 1) % 3] as [number, number],
  points: index % 3 === 0 ? 5 : index % 3 === 1 ? 3 : 0,
  result: index % 3 === 0 ? "exact" : index % 3 === 1 ? "outcome" : "wrong"
}));

export const pointEvents = [
  { label: "Exact score: Brazil 2-1 Croatia", value: 5, type: "exact" },
  { label: "Correct outcome: France vs Colombia", value: 3, type: "outcome" },
  { label: "Goal bonus: Poland scored 1", value: 1, type: "goal bonus" },
  { label: "Hidden pending: Group H standings", value: 0, type: "hidden" },
  { label: "Locked: Final champion pick", value: 0, type: "locked" }
];

export const scoringRules = [
  {
    title: "Group-stage match prediction",
    icon: CircleDot,
    rules: ["exact score: 5", "correct outcome: 3", "correct goal difference: 2", "correct goals for one team: 1"]
  },
  {
    title: "Group final standings prediction",
    icon: Shield,
    rules: ["exact team position: 3", "team in top 2 but wrong exact position: 1", "best third-place qualifier: 1", "perfect group order bonus: 3"]
  },
  {
    title: "Knockout prediction",
    icon: Trophy,
    rules: ["exact score after 90 minutes: 5", "correct winner: 3", "correct goal difference: 2", "champion: 10", "runner-up: 6", "third place: 4"]
  }
];

export const dashboardStats = [
  { label: "Current rank", value: "#1", detail: "Lider Gwardii", icon: Crown },
  { label: "Total points", value: "142", detail: "+8 today", icon: Trophy },
  { label: "Group match points", value: "68", detail: "48 fixtures tracked", icon: CircleDot },
  { label: "Group standings points", value: "30", detail: "12 groups", icon: Shield },
  { label: "Knockout points", value: "34", detail: "Bracket draft live", icon: Medal },
  { label: "Next prediction deadline", value: "17:50", detail: "10 min before USA vs Germany", icon: Beer }
];

export const adminLogs = [
  { time: "2026-06-11 08:15", job: "fixtures.import", status: "success", detail: "48 group fixtures staged" },
  { time: "2026-06-11 08:20", job: "results.sync", status: "success", detail: "5 results updated" },
  { time: "2026-06-11 08:33", job: "points.recalculate", status: "warning", detail: "2 locked matches skipped" },
  { time: "2026-06-11 09:10", job: "league.invite", status: "success", detail: "GWARDIA-PIWO-2026 active" }
];

export const placeholderIntegrations = {
  supabase: "connectAuthAndPredictions",
  cron: "syncResultsWithVercelCron",
  footballData: "fetchFixturesFromFootballDataOrg"
};
