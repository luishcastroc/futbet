import { User } from '@angular/fire/auth';

export interface Result {
  id: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  goldenBall: boolean;
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
