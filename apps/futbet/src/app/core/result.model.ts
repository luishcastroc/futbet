import { User } from '@angular/fire/auth';

export interface Result {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  goldenBall: boolean;
  matchDay: number;
}

export interface Game {
  id: number;
  group: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  homeTeamEs: string;
  awayTeamEs: string;
  homeFlag: string;
  awayFlag: string;
  matchDay: number;
}

export interface Results {
  userId: string;
  generationDate: Date;
  updateDate: Date;
  results: Result[];
}

export interface UserPoints {
  user: User;
  score: number;
}
