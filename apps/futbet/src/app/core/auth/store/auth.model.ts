import { User } from '../user.model';

export interface AuthStateModel {
  user?: User | null;
}
