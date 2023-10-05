// eslint-disable-next-line import/prefer-default-export
export type { default as HTMLElementEvent } from './html-element-event/html-element-event.type';

export type TCurrentUser = {
  id: number;
  name: string;
  email: string;
  role: {
    role_id: number;
    role_name: string;
  };
  avatar: string;
  created_at: string;
  updated_at: string;
  defaultRoute: string;
};
