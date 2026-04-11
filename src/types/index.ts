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
