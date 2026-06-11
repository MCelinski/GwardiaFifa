export type OfficialScheduleMatch = {
  id: number;
  utcDate: string;
  status: string;
  stage: string | null;
  group: string | null;
  matchday: number | null;
  homeTeam: { name: string | null; shortName: string | null; tla: string | null };
  awayTeam: { name: string | null; shortName: string | null; tla: string | null };
};

export const officialWorldCupSchedule: OfficialScheduleMatch[] = [
    {
        "id":  537327,
        "utcDate":  "2026-06-11T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_A",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Mexico",
                         "shortName":  "Mexico",
                         "tla":  "MEX"
                     },
        "awayTeam":  {
                         "name":  "South Africa",
                         "shortName":  "South Africa",
                         "tla":  "RSA"
                     }
    },
    {
        "id":  537328,
        "utcDate":  "2026-06-12T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_A",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "South Korea",
                         "shortName":  "Korea Republic",
                         "tla":  "KOR"
                     },
        "awayTeam":  {
                         "name":  "Czechia",
                         "shortName":  "Czechia",
                         "tla":  "CZE"
                     }
    },
    {
        "id":  537333,
        "utcDate":  "2026-06-12T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_B",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Canada",
                         "shortName":  "Canada",
                         "tla":  "CAN"
                     },
        "awayTeam":  {
                         "name":  "Bosnia-Herzegovina",
                         "shortName":  "Bosnia-H.",
                         "tla":  "BIH"
                     }
    },
    {
        "id":  537345,
        "utcDate":  "2026-06-13T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_D",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "United States",
                         "shortName":  "USA",
                         "tla":  "USA"
                     },
        "awayTeam":  {
                         "name":  "Paraguay",
                         "shortName":  "Paraguay",
                         "tla":  "PAR"
                     }
    },
    {
        "id":  537334,
        "utcDate":  "2026-06-13T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_B",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Qatar",
                         "shortName":  "Qatar",
                         "tla":  "QAT"
                     },
        "awayTeam":  {
                         "name":  "Switzerland",
                         "shortName":  "Switzerland",
                         "tla":  "SUI"
                     }
    },
    {
        "id":  537339,
        "utcDate":  "2026-06-13T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_C",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Brazil",
                         "shortName":  "Brazil",
                         "tla":  "BRA"
                     },
        "awayTeam":  {
                         "name":  "Morocco",
                         "shortName":  "Morocco",
                         "tla":  "MAR"
                     }
    },
    {
        "id":  537340,
        "utcDate":  "2026-06-14T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_C",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Haiti",
                         "shortName":  "Haiti",
                         "tla":  "HAI"
                     },
        "awayTeam":  {
                         "name":  "Scotland",
                         "shortName":  "Scotland",
                         "tla":  "SCO"
                     }
    },
    {
        "id":  537346,
        "utcDate":  "2026-06-14T04:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_D",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Australia",
                         "shortName":  "Australia",
                         "tla":  "AUS"
                     },
        "awayTeam":  {
                         "name":  "Turkey",
                         "shortName":  "Turkey",
                         "tla":  "TUR"
                     }
    },
    {
        "id":  537351,
        "utcDate":  "2026-06-14T17:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_E",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Germany",
                         "shortName":  "Germany",
                         "tla":  "GER"
                     },
        "awayTeam":  {
                         "name":  "Curaçao",
                         "shortName":  "Curaçao",
                         "tla":  "CUW"
                     }
    },
    {
        "id":  537357,
        "utcDate":  "2026-06-14T20:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_F",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Netherlands",
                         "shortName":  "Netherlands",
                         "tla":  "NED"
                     },
        "awayTeam":  {
                         "name":  "Japan",
                         "shortName":  "Japan",
                         "tla":  "JPN"
                     }
    },
    {
        "id":  537352,
        "utcDate":  "2026-06-14T23:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_E",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Ivory Coast",
                         "shortName":  "Ivory Coast",
                         "tla":  "CIV"
                     },
        "awayTeam":  {
                         "name":  "Ecuador",
                         "shortName":  "Ecuador",
                         "tla":  "ECU"
                     }
    },
    {
        "id":  537358,
        "utcDate":  "2026-06-15T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_F",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Sweden",
                         "shortName":  "Sweden",
                         "tla":  "SWE"
                     },
        "awayTeam":  {
                         "name":  "Tunisia",
                         "shortName":  "Tunisia",
                         "tla":  "TUN"
                     }
    },
    {
        "id":  537369,
        "utcDate":  "2026-06-15T16:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_H",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Spain",
                         "shortName":  "Spain",
                         "tla":  "ESP"
                     },
        "awayTeam":  {
                         "name":  "Cape Verde Islands",
                         "shortName":  "Cape Verde",
                         "tla":  "CPV"
                     }
    },
    {
        "id":  537363,
        "utcDate":  "2026-06-15T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_G",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Belgium",
                         "shortName":  "Belgium",
                         "tla":  "BEL"
                     },
        "awayTeam":  {
                         "name":  "Egypt",
                         "shortName":  "Egypt",
                         "tla":  "EGY"
                     }
    },
    {
        "id":  537370,
        "utcDate":  "2026-06-15T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_H",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Saudi Arabia",
                         "shortName":  "Saudi Arabia",
                         "tla":  "KSA"
                     },
        "awayTeam":  {
                         "name":  "Uruguay",
                         "shortName":  "Uruguay",
                         "tla":  "URY"
                     }
    },
    {
        "id":  537364,
        "utcDate":  "2026-06-16T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_G",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Iran",
                         "shortName":  "Iran",
                         "tla":  "IRN"
                     },
        "awayTeam":  {
                         "name":  "New Zealand",
                         "shortName":  "New Zealand",
                         "tla":  "NZL"
                     }
    },
    {
        "id":  537391,
        "utcDate":  "2026-06-16T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_I",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "France",
                         "shortName":  "France",
                         "tla":  "FRA"
                     },
        "awayTeam":  {
                         "name":  "Senegal",
                         "shortName":  "Senegal",
                         "tla":  "SEN"
                     }
    },
    {
        "id":  537392,
        "utcDate":  "2026-06-16T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_I",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Iraq",
                         "shortName":  "Iraq",
                         "tla":  "IRQ"
                     },
        "awayTeam":  {
                         "name":  "Norway",
                         "shortName":  "Norway",
                         "tla":  "NOR"
                     }
    },
    {
        "id":  537397,
        "utcDate":  "2026-06-17T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_J",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Argentina",
                         "shortName":  "Argentina",
                         "tla":  "ARG"
                     },
        "awayTeam":  {
                         "name":  "Algeria",
                         "shortName":  "Algeria",
                         "tla":  "ALG"
                     }
    },
    {
        "id":  537398,
        "utcDate":  "2026-06-17T04:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_J",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Austria",
                         "shortName":  "Austria",
                         "tla":  "AUT"
                     },
        "awayTeam":  {
                         "name":  "Jordan",
                         "shortName":  "Jordan",
                         "tla":  "JOR"
                     }
    },
    {
        "id":  537403,
        "utcDate":  "2026-06-17T17:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_K",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Portugal",
                         "shortName":  "Portugal",
                         "tla":  "POR"
                     },
        "awayTeam":  {
                         "name":  "Congo DR",
                         "shortName":  "Congo DR",
                         "tla":  "COD"
                     }
    },
    {
        "id":  537409,
        "utcDate":  "2026-06-17T20:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_L",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "England",
                         "shortName":  "England",
                         "tla":  "ENG"
                     },
        "awayTeam":  {
                         "name":  "Croatia",
                         "shortName":  "Croatia",
                         "tla":  "CRO"
                     }
    },
    {
        "id":  537410,
        "utcDate":  "2026-06-17T23:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_L",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Ghana",
                         "shortName":  "Ghana",
                         "tla":  "GHA"
                     },
        "awayTeam":  {
                         "name":  "Panama",
                         "shortName":  "Panama",
                         "tla":  "PAN"
                     }
    },
    {
        "id":  537404,
        "utcDate":  "2026-06-18T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_K",
        "matchday":  1,
        "homeTeam":  {
                         "name":  "Uzbekistan",
                         "shortName":  "Uzbekistan",
                         "tla":  "UZB"
                     },
        "awayTeam":  {
                         "name":  "Colombia",
                         "shortName":  "Colombia",
                         "tla":  "COL"
                     }
    },
    {
        "id":  537329,
        "utcDate":  "2026-06-18T16:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_A",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Czechia",
                         "shortName":  "Czechia",
                         "tla":  "CZE"
                     },
        "awayTeam":  {
                         "name":  "South Africa",
                         "shortName":  "South Africa",
                         "tla":  "RSA"
                     }
    },
    {
        "id":  537335,
        "utcDate":  "2026-06-18T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_B",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Switzerland",
                         "shortName":  "Switzerland",
                         "tla":  "SUI"
                     },
        "awayTeam":  {
                         "name":  "Bosnia-Herzegovina",
                         "shortName":  "Bosnia-H.",
                         "tla":  "BIH"
                     }
    },
    {
        "id":  537336,
        "utcDate":  "2026-06-18T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_B",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Canada",
                         "shortName":  "Canada",
                         "tla":  "CAN"
                     },
        "awayTeam":  {
                         "name":  "Qatar",
                         "shortName":  "Qatar",
                         "tla":  "QAT"
                     }
    },
    {
        "id":  537330,
        "utcDate":  "2026-06-19T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_A",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Mexico",
                         "shortName":  "Mexico",
                         "tla":  "MEX"
                     },
        "awayTeam":  {
                         "name":  "South Korea",
                         "shortName":  "Korea Republic",
                         "tla":  "KOR"
                     }
    },
    {
        "id":  537348,
        "utcDate":  "2026-06-19T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_D",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "United States",
                         "shortName":  "USA",
                         "tla":  "USA"
                     },
        "awayTeam":  {
                         "name":  "Australia",
                         "shortName":  "Australia",
                         "tla":  "AUS"
                     }
    },
    {
        "id":  537342,
        "utcDate":  "2026-06-19T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_C",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Scotland",
                         "shortName":  "Scotland",
                         "tla":  "SCO"
                     },
        "awayTeam":  {
                         "name":  "Morocco",
                         "shortName":  "Morocco",
                         "tla":  "MAR"
                     }
    },
    {
        "id":  537341,
        "utcDate":  "2026-06-20T00:30:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_C",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Brazil",
                         "shortName":  "Brazil",
                         "tla":  "BRA"
                     },
        "awayTeam":  {
                         "name":  "Haiti",
                         "shortName":  "Haiti",
                         "tla":  "HAI"
                     }
    },
    {
        "id":  537347,
        "utcDate":  "2026-06-20T03:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_D",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Turkey",
                         "shortName":  "Turkey",
                         "tla":  "TUR"
                     },
        "awayTeam":  {
                         "name":  "Paraguay",
                         "shortName":  "Paraguay",
                         "tla":  "PAR"
                     }
    },
    {
        "id":  537359,
        "utcDate":  "2026-06-20T17:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_F",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Netherlands",
                         "shortName":  "Netherlands",
                         "tla":  "NED"
                     },
        "awayTeam":  {
                         "name":  "Sweden",
                         "shortName":  "Sweden",
                         "tla":  "SWE"
                     }
    },
    {
        "id":  537353,
        "utcDate":  "2026-06-20T20:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_E",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Germany",
                         "shortName":  "Germany",
                         "tla":  "GER"
                     },
        "awayTeam":  {
                         "name":  "Ivory Coast",
                         "shortName":  "Ivory Coast",
                         "tla":  "CIV"
                     }
    },
    {
        "id":  537354,
        "utcDate":  "2026-06-21T00:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_E",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Ecuador",
                         "shortName":  "Ecuador",
                         "tla":  "ECU"
                     },
        "awayTeam":  {
                         "name":  "Curaçao",
                         "shortName":  "Curaçao",
                         "tla":  "CUW"
                     }
    },
    {
        "id":  537360,
        "utcDate":  "2026-06-21T04:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_F",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Tunisia",
                         "shortName":  "Tunisia",
                         "tla":  "TUN"
                     },
        "awayTeam":  {
                         "name":  "Japan",
                         "shortName":  "Japan",
                         "tla":  "JPN"
                     }
    },
    {
        "id":  537371,
        "utcDate":  "2026-06-21T16:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_H",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Spain",
                         "shortName":  "Spain",
                         "tla":  "ESP"
                     },
        "awayTeam":  {
                         "name":  "Saudi Arabia",
                         "shortName":  "Saudi Arabia",
                         "tla":  "KSA"
                     }
    },
    {
        "id":  537365,
        "utcDate":  "2026-06-21T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_G",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Belgium",
                         "shortName":  "Belgium",
                         "tla":  "BEL"
                     },
        "awayTeam":  {
                         "name":  "Iran",
                         "shortName":  "Iran",
                         "tla":  "IRN"
                     }
    },
    {
        "id":  537372,
        "utcDate":  "2026-06-21T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_H",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Uruguay",
                         "shortName":  "Uruguay",
                         "tla":  "URY"
                     },
        "awayTeam":  {
                         "name":  "Cape Verde Islands",
                         "shortName":  "Cape Verde",
                         "tla":  "CPV"
                     }
    },
    {
        "id":  537366,
        "utcDate":  "2026-06-22T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_G",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "New Zealand",
                         "shortName":  "New Zealand",
                         "tla":  "NZL"
                     },
        "awayTeam":  {
                         "name":  "Egypt",
                         "shortName":  "Egypt",
                         "tla":  "EGY"
                     }
    },
    {
        "id":  537399,
        "utcDate":  "2026-06-22T17:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_J",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Argentina",
                         "shortName":  "Argentina",
                         "tla":  "ARG"
                     },
        "awayTeam":  {
                         "name":  "Austria",
                         "shortName":  "Austria",
                         "tla":  "AUT"
                     }
    },
    {
        "id":  537393,
        "utcDate":  "2026-06-22T21:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_I",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "France",
                         "shortName":  "France",
                         "tla":  "FRA"
                     },
        "awayTeam":  {
                         "name":  "Iraq",
                         "shortName":  "Iraq",
                         "tla":  "IRQ"
                     }
    },
    {
        "id":  537394,
        "utcDate":  "2026-06-23T00:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_I",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Norway",
                         "shortName":  "Norway",
                         "tla":  "NOR"
                     },
        "awayTeam":  {
                         "name":  "Senegal",
                         "shortName":  "Senegal",
                         "tla":  "SEN"
                     }
    },
    {
        "id":  537400,
        "utcDate":  "2026-06-23T03:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_J",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Jordan",
                         "shortName":  "Jordan",
                         "tla":  "JOR"
                     },
        "awayTeam":  {
                         "name":  "Algeria",
                         "shortName":  "Algeria",
                         "tla":  "ALG"
                     }
    },
    {
        "id":  537405,
        "utcDate":  "2026-06-23T17:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_K",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Portugal",
                         "shortName":  "Portugal",
                         "tla":  "POR"
                     },
        "awayTeam":  {
                         "name":  "Uzbekistan",
                         "shortName":  "Uzbekistan",
                         "tla":  "UZB"
                     }
    },
    {
        "id":  537411,
        "utcDate":  "2026-06-23T20:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_L",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "England",
                         "shortName":  "England",
                         "tla":  "ENG"
                     },
        "awayTeam":  {
                         "name":  "Ghana",
                         "shortName":  "Ghana",
                         "tla":  "GHA"
                     }
    },
    {
        "id":  537412,
        "utcDate":  "2026-06-23T23:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_L",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Panama",
                         "shortName":  "Panama",
                         "tla":  "PAN"
                     },
        "awayTeam":  {
                         "name":  "Croatia",
                         "shortName":  "Croatia",
                         "tla":  "CRO"
                     }
    },
    {
        "id":  537406,
        "utcDate":  "2026-06-24T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_K",
        "matchday":  2,
        "homeTeam":  {
                         "name":  "Colombia",
                         "shortName":  "Colombia",
                         "tla":  "COL"
                     },
        "awayTeam":  {
                         "name":  "Congo DR",
                         "shortName":  "Congo DR",
                         "tla":  "COD"
                     }
    },
    {
        "id":  537337,
        "utcDate":  "2026-06-24T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_B",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Switzerland",
                         "shortName":  "Switzerland",
                         "tla":  "SUI"
                     },
        "awayTeam":  {
                         "name":  "Canada",
                         "shortName":  "Canada",
                         "tla":  "CAN"
                     }
    },
    {
        "id":  537338,
        "utcDate":  "2026-06-24T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_B",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Bosnia-Herzegovina",
                         "shortName":  "Bosnia-H.",
                         "tla":  "BIH"
                     },
        "awayTeam":  {
                         "name":  "Qatar",
                         "shortName":  "Qatar",
                         "tla":  "QAT"
                     }
    },
    {
        "id":  537344,
        "utcDate":  "2026-06-24T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_C",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Morocco",
                         "shortName":  "Morocco",
                         "tla":  "MAR"
                     },
        "awayTeam":  {
                         "name":  "Haiti",
                         "shortName":  "Haiti",
                         "tla":  "HAI"
                     }
    },
    {
        "id":  537343,
        "utcDate":  "2026-06-24T22:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_C",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Scotland",
                         "shortName":  "Scotland",
                         "tla":  "SCO"
                     },
        "awayTeam":  {
                         "name":  "Brazil",
                         "shortName":  "Brazil",
                         "tla":  "BRA"
                     }
    },
    {
        "id":  537331,
        "utcDate":  "2026-06-25T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_A",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Czechia",
                         "shortName":  "Czechia",
                         "tla":  "CZE"
                     },
        "awayTeam":  {
                         "name":  "Mexico",
                         "shortName":  "Mexico",
                         "tla":  "MEX"
                     }
    },
    {
        "id":  537332,
        "utcDate":  "2026-06-25T01:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_A",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "South Africa",
                         "shortName":  "South Africa",
                         "tla":  "RSA"
                     },
        "awayTeam":  {
                         "name":  "South Korea",
                         "shortName":  "Korea Republic",
                         "tla":  "KOR"
                     }
    },
    {
        "id":  537355,
        "utcDate":  "2026-06-25T20:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_E",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Ecuador",
                         "shortName":  "Ecuador",
                         "tla":  "ECU"
                     },
        "awayTeam":  {
                         "name":  "Germany",
                         "shortName":  "Germany",
                         "tla":  "GER"
                     }
    },
    {
        "id":  537356,
        "utcDate":  "2026-06-25T20:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_E",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Curaçao",
                         "shortName":  "Curaçao",
                         "tla":  "CUW"
                     },
        "awayTeam":  {
                         "name":  "Ivory Coast",
                         "shortName":  "Ivory Coast",
                         "tla":  "CIV"
                     }
    },
    {
        "id":  537361,
        "utcDate":  "2026-06-25T23:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_F",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Tunisia",
                         "shortName":  "Tunisia",
                         "tla":  "TUN"
                     },
        "awayTeam":  {
                         "name":  "Netherlands",
                         "shortName":  "Netherlands",
                         "tla":  "NED"
                     }
    },
    {
        "id":  537362,
        "utcDate":  "2026-06-25T23:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_F",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Japan",
                         "shortName":  "Japan",
                         "tla":  "JPN"
                     },
        "awayTeam":  {
                         "name":  "Sweden",
                         "shortName":  "Sweden",
                         "tla":  "SWE"
                     }
    },
    {
        "id":  537349,
        "utcDate":  "2026-06-26T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_D",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Turkey",
                         "shortName":  "Turkey",
                         "tla":  "TUR"
                     },
        "awayTeam":  {
                         "name":  "United States",
                         "shortName":  "USA",
                         "tla":  "USA"
                     }
    },
    {
        "id":  537350,
        "utcDate":  "2026-06-26T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_D",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Paraguay",
                         "shortName":  "Paraguay",
                         "tla":  "PAR"
                     },
        "awayTeam":  {
                         "name":  "Australia",
                         "shortName":  "Australia",
                         "tla":  "AUS"
                     }
    },
    {
        "id":  537395,
        "utcDate":  "2026-06-26T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_I",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Norway",
                         "shortName":  "Norway",
                         "tla":  "NOR"
                     },
        "awayTeam":  {
                         "name":  "France",
                         "shortName":  "France",
                         "tla":  "FRA"
                     }
    },
    {
        "id":  537396,
        "utcDate":  "2026-06-26T19:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_I",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Senegal",
                         "shortName":  "Senegal",
                         "tla":  "SEN"
                     },
        "awayTeam":  {
                         "name":  "Iraq",
                         "shortName":  "Iraq",
                         "tla":  "IRQ"
                     }
    },
    {
        "id":  537373,
        "utcDate":  "2026-06-27T00:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_H",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Uruguay",
                         "shortName":  "Uruguay",
                         "tla":  "URY"
                     },
        "awayTeam":  {
                         "name":  "Spain",
                         "shortName":  "Spain",
                         "tla":  "ESP"
                     }
    },
    {
        "id":  537374,
        "utcDate":  "2026-06-27T00:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_H",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Cape Verde Islands",
                         "shortName":  "Cape Verde",
                         "tla":  "CPV"
                     },
        "awayTeam":  {
                         "name":  "Saudi Arabia",
                         "shortName":  "Saudi Arabia",
                         "tla":  "KSA"
                     }
    },
    {
        "id":  537367,
        "utcDate":  "2026-06-27T03:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_G",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "New Zealand",
                         "shortName":  "New Zealand",
                         "tla":  "NZL"
                     },
        "awayTeam":  {
                         "name":  "Belgium",
                         "shortName":  "Belgium",
                         "tla":  "BEL"
                     }
    },
    {
        "id":  537368,
        "utcDate":  "2026-06-27T03:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_G",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Egypt",
                         "shortName":  "Egypt",
                         "tla":  "EGY"
                     },
        "awayTeam":  {
                         "name":  "Iran",
                         "shortName":  "Iran",
                         "tla":  "IRN"
                     }
    },
    {
        "id":  537413,
        "utcDate":  "2026-06-27T21:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_L",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Panama",
                         "shortName":  "Panama",
                         "tla":  "PAN"
                     },
        "awayTeam":  {
                         "name":  "England",
                         "shortName":  "England",
                         "tla":  "ENG"
                     }
    },
    {
        "id":  537414,
        "utcDate":  "2026-06-27T21:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_L",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Croatia",
                         "shortName":  "Croatia",
                         "tla":  "CRO"
                     },
        "awayTeam":  {
                         "name":  "Ghana",
                         "shortName":  "Ghana",
                         "tla":  "GHA"
                     }
    },
    {
        "id":  537407,
        "utcDate":  "2026-06-27T23:30:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_K",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Colombia",
                         "shortName":  "Colombia",
                         "tla":  "COL"
                     },
        "awayTeam":  {
                         "name":  "Portugal",
                         "shortName":  "Portugal",
                         "tla":  "POR"
                     }
    },
    {
        "id":  537408,
        "utcDate":  "2026-06-27T23:30:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_K",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Congo DR",
                         "shortName":  "Congo DR",
                         "tla":  "COD"
                     },
        "awayTeam":  {
                         "name":  "Uzbekistan",
                         "shortName":  "Uzbekistan",
                         "tla":  "UZB"
                     }
    },
    {
        "id":  537401,
        "utcDate":  "2026-06-28T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_J",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Jordan",
                         "shortName":  "Jordan",
                         "tla":  "JOR"
                     },
        "awayTeam":  {
                         "name":  "Argentina",
                         "shortName":  "Argentina",
                         "tla":  "ARG"
                     }
    },
    {
        "id":  537402,
        "utcDate":  "2026-06-28T02:00:00Z",
        "status":  "TIMED",
        "stage":  "GROUP_STAGE",
        "group":  "GROUP_J",
        "matchday":  3,
        "homeTeam":  {
                         "name":  "Algeria",
                         "shortName":  "Algeria",
                         "tla":  "ALG"
                     },
        "awayTeam":  {
                         "name":  "Austria",
                         "shortName":  "Austria",
                         "tla":  "AUT"
                     }
    },
    {
        "id":  537417,
        "utcDate":  "2026-06-28T19:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537423,
        "utcDate":  "2026-06-29T17:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537415,
        "utcDate":  "2026-06-29T20:30:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537418,
        "utcDate":  "2026-06-30T01:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537424,
        "utcDate":  "2026-06-30T17:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537416,
        "utcDate":  "2026-06-30T21:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537425,
        "utcDate":  "2026-07-01T01:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537426,
        "utcDate":  "2026-07-01T16:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537422,
        "utcDate":  "2026-07-01T20:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537421,
        "utcDate":  "2026-07-02T00:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537420,
        "utcDate":  "2026-07-02T19:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537419,
        "utcDate":  "2026-07-02T23:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537429,
        "utcDate":  "2026-07-03T03:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537428,
        "utcDate":  "2026-07-03T18:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537427,
        "utcDate":  "2026-07-03T22:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537430,
        "utcDate":  "2026-07-04T01:30:00Z",
        "status":  "TIMED",
        "stage":  "LAST_32",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537376,
        "utcDate":  "2026-07-04T17:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537375,
        "utcDate":  "2026-07-04T21:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537377,
        "utcDate":  "2026-07-05T20:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537378,
        "utcDate":  "2026-07-06T00:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537379,
        "utcDate":  "2026-07-06T19:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537380,
        "utcDate":  "2026-07-07T00:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537381,
        "utcDate":  "2026-07-07T16:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537382,
        "utcDate":  "2026-07-07T20:00:00Z",
        "status":  "TIMED",
        "stage":  "LAST_16",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537383,
        "utcDate":  "2026-07-09T20:00:00Z",
        "status":  "TIMED",
        "stage":  "QUARTER_FINALS",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537384,
        "utcDate":  "2026-07-10T19:00:00Z",
        "status":  "TIMED",
        "stage":  "QUARTER_FINALS",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537385,
        "utcDate":  "2026-07-11T21:00:00Z",
        "status":  "TIMED",
        "stage":  "QUARTER_FINALS",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537386,
        "utcDate":  "2026-07-12T01:00:00Z",
        "status":  "TIMED",
        "stage":  "QUARTER_FINALS",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537387,
        "utcDate":  "2026-07-14T19:00:00Z",
        "status":  "TIMED",
        "stage":  "SEMI_FINALS",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537388,
        "utcDate":  "2026-07-15T19:00:00Z",
        "status":  "TIMED",
        "stage":  "SEMI_FINALS",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537389,
        "utcDate":  "2026-07-18T21:00:00Z",
        "status":  "TIMED",
        "stage":  "THIRD_PLACE",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    },
    {
        "id":  537390,
        "utcDate":  "2026-07-19T19:00:00Z",
        "status":  "TIMED",
        "stage":  "FINAL",
        "group":  null,
        "matchday":  null,
        "homeTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     },
        "awayTeam":  {
                         "name":  null,
                         "shortName":  null,
                         "tla":  null
                     }
    }
] as OfficialScheduleMatch[];

