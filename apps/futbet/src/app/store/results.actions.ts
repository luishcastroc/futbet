import { Results } from '../core/result.model';

export class GetAll {
  public static readonly type = '[Results] GetAll';
}

export class Create {
  public static readonly type = '[Results] Create';
  constructor(public payload: Results) {}
}
