import { Game, Results } from '../core/result.model';

export class GetAll {
  public static readonly type = '[Results] GetAll';
}

export class GetUserResults {
  public static readonly type = '[Results] GetUserResults';
  constructor(public payload: string | null) {}
}

export class Create {
  public static readonly type = '[Results] Create';
  constructor(public payload: Results) {}
}

export class Update {
  public static readonly type = '[Results] Update';
  constructor(public payload: Results) {}
}

export class SeedGames {
  public static readonly type = '[Games] SeedGames';
  constructor(public payload: Game) {}
}

export class GetAllGames {
  public static readonly type = '[Games] GetAllGames';
}

export class ClearResultsState {
  public static readonly type = '[Games] ClearResultsState';
}

export class ClearUserResults {
  public static readonly type = '[Games] ClearUserResults';
}
