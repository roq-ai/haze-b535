import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CommandInterface {
  id?: string;
  command_text: string;
  result_text: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface CommandGetQueryInterface extends GetQueryInterface {
  id?: string;
  command_text?: string;
  result_text?: string;
  user_id?: string;
}
