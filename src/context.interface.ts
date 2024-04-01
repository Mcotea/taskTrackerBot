import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?:
      | 'done'
      | 'edit'
      | 'remove'
      | 'create'
      | 'edit name'
      | 'edit tag'
      | 'edit deadline'
      | 'back';
  };
}
