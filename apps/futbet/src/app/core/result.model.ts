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

export enum GameStatuses {
  NotStarted = 'NOT STARTED',
  Started = 'STARTED',
  Finished = 'FINISHED',
}

export interface Game {
  id: number;
  group?: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  homeTeamEs: string;
  awayTeamEs: string;
  homeFlag: string;
  awayFlag: string;
  matchDay: number;
  gameStatus: string;
}

export interface Results {
  id?: string;
  userId: string;
  displayName?: string;
  generationDate: Date;
  updateDate: Date;
  results: Result[];
}

export interface UserPoints {
  user: User;
  score: number;
}

export interface FutBetUser {
  uid: string;
  displayName: string;
  email: string;
}
