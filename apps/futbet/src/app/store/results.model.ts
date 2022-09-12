import { Game, Results, UserPoints } from '../core/result.model';

export interface ResultsStateModel {
  userResults: Results | undefined;
  results: Results[];
  ranking: UserPoints[];
  games: Game[];
}
