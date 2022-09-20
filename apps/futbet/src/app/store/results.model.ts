import { Ranking } from '../core';
import { FutBetUser, Game, Results } from '../core/result.model';

export interface ResultsStateModel {
  userResults: Results | undefined;
  results: Results[];
  ranking: Ranking[];
  games: Game[];
  users: FutBetUser[];
}
