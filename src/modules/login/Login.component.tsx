import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import session, { SessionData } from '../../config/session/session.config';
import loginApi from './login.api';

import './login.css';
import { useThemeStore } from '../../config/hooks';

type LoginDto = {
  username: string;
  password: string;
};

type LocationType = {
  state?: {
    from?: {
      pathname?: string;
    };
  };
};

const Login: React.FC = () => {
  const { theme } = useThemeStore();
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = React.useState<LoginDto>({
    username: '',
    password: '',
  });
  const lastLocation = (location as LocationType)?.state?.from?.pathname || '/';

  const userRef = useRef<HTMLInputElement>(null);

  const loginQuery = useQuery<AxiosResponse>('login', async () => loginApi.login(loginData), {
    enabled: false,
    onSuccess: async (response) => {
      const { headers, data } = response;
      if (data.status === 'failed') {
        return setInvalidCredentials(true);
      }
      const dto: SessionData = {
        token: headers['x-access-token'] || '',
        id: headers['x-user-id'] || '',
        username: data.username,
      };
      const user = await session.createSession(dto, data);
      localStorage.setItem('newLogin', 'true');
      if (lastLocation === '/') return navigate(user.defaultRoute);
      return navigate(lastLocation, { replace: true });
    },
    onError: () => {
      setInvalidCredentials(true);
      userRef?.current?.focus();
    },
  });

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvalidCredentials(false);
    loginQuery.refetch();
  };

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  // bg-gradient-to-r from-gray-700 to-gray-400

  return (
    <div
      className={`${theme} flex min-h-screen flex-col justify-center bg-gradient-to-tl from-primaryDark to-primary py-6 antialiased sm:py-12 `}
    >
      <div className="login-logo relative mx-auto flex flex-col items-center justify-center text-center sm:w-[40%]">
        <img src="vite.svg" alt="main-logo" className="w-48" />
        <p className="mb-10 text-3xl font-bold text-white"> &quot;Vite Boilerplate...&quot;</p>
      </div>
      <div className="relative mx-auto rounded-lg bg-white text-left shadow-md sm:w-2/4">
        <div className="h-2 rounded-t-md bg-primary" />
        <form className="px-8 py-6" onSubmit={(e) => login(e)}>
          <label className="black font-semibold" htmlFor="username-or-email">
            Username or Email
            <input
              ref={userRef}
              id="username-or-email"
              type="text"
              placeholder="Username or Email"
              required
              className="login-input"
              value={loginData.username}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setLoginData({ ...loginData, username: target.value });
              }}
            />
          </label>
          <label className="font-semibold" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="login-input"
              required
              value={loginData.password}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setLoginData({ ...loginData, password: target.value });
              }}
            />
          </label>
          {invalidCredentials && <span className="text-primary">Invalid Credentials!</span>}
          <div className="flex items-baseline justify-between">
            <button disabled={loginQuery.isFetching} type="submit" className="login-btn">
              {loginQuery.isFetching ? (
                <div className="flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primaryDark" />
                </div>
              ) : (
                'Login'
              )}
            </button>
            <button type="button" className="text-sm hover:underline">
              Forgot Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
