import api from '../../config/api/api.config';

type LoginDto = {
  username: string;
  password: string;
};

const loginApi = {
  login: async (payload: LoginDto) => api.post('login', payload),
};

export default loginApi;
