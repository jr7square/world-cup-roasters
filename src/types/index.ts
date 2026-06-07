export interface Player {
  number: number | null;
  position: "GK" | "DF" | "MF" | "FW" | string;
  name: string;
  isCaptain: boolean;
  club: string;
  clubCountry: string;
  league: string;
  tier: string;
}

export interface TeamRoster {
  group: string;
  players: Player[];
}

export interface Tournament {
  year: number;
  teamCount: number;
  squadSize: number;
  teams: Record<string, TeamRoster>;
}

export interface CountryMeta {
  name: string;
  tournaments: number[];
}

export interface WorldCupData {
  tournaments: Tournament[];
  countries: CountryMeta[];
}

export interface StatRow {
  stat: string;
  value: string;
}

export interface PlayerProfile {
  name: string;
  country: string;
  position: string;
  club: string;
  age: number | null;
  profile: string;
  strengths: string[];
  weaknesses: string[];
  fbrefUrl: string | null;
  stats: {
    label: string;
    rows: StatRow[];
  } | null;
}

export interface PlayerProfilesData {
  players: Record<string, PlayerProfile>;
}
