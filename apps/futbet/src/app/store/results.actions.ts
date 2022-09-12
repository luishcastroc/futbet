import { Game, Results } from '../core/result.model';

export class GetAll {
  public static readonly type = '[Results] GetAll';
}

export class GetUserResults {
  public static readonly type = '[Results] GetUserResults';
  constructor(public payload: string) {}
}

export class Create {
  public static readonly type = '[Results] Create';
  constructor(public payload: Results) {}
}

export class SeedGames {
  public static readonly type = '[Games] SeedGames';
  constructor(public payload: Game) {}
}
