import api from '@api';
import { AxiosResponse } from 'axios';
import { TCurrentUser } from './types';

const sharedApi = {
  getCurrentUser: (
    headers?: unknown,
  ): Promise<
    AxiosResponse<
      TCurrentUser & {
        action: string;
        status: 'successful' | 'failed';
        message?: Partial<string>;
      }
    >
  > => api.get('current-user', headers ? { headers } : {}),
  logout: () => api.post('logout'),
};

export default sharedApi;
