/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import api from '@api';
import { TCurrentUser } from '@common/types';
import sharedApi from '@common/shared.api';
import routes from './route-roles.json';

export type SessionData = {
  id: string;
  token: string;
  expiry?: number;
};

type Route = {
  path: string;
  roles: number[];
};

let refreshTimeOut: NodeJS.Timeout;

const session = {
  /**
   * Creates in memory session using local storage
   * TODO: If expiry is provided refresh session 60 seconds before expiring (Depending upon backend implementation)
   * @param  { id: xUserId, token: decoded_access_token } data
   * returns user
   */
  createSession: (sessionData: SessionData): Promise<TCurrentUser | boolean> => {
    if (sessionData.expiry) {
      const nextRefresh = (sessionData.expiry - 60) * 1000;
      refreshTimeOut = setTimeout(async () => {
        // const response = await sharedApi.refreshSession();
        // if (response.status === 201) session.createSession(response.sessionData);
      }, nextRefresh);
    }
    return session.verifyAndUpdateUser(sessionData);
  },
  /**
   * Gets current user session from local storage
   * returns user object if user exists else returns undefined
   */
  getCurrentSession: (): TCurrentUser | undefined => {
    const user = localStorage.getItem('currentUser');
    if (user) return JSON.parse(user) as TCurrentUser;
    return undefined;
  },
  /**
   * Checks if user is logged in or not
   * @returns TCurrentUser | undefined
   */
  isLoggedIn: (): TCurrentUser | undefined => {
    const user = localStorage.getItem('currentUser');
    const token = localStorage.getItem('sessionToken');
    if (user && token) return JSON.parse(user);
    return undefined;
  },
  /**
   * Destroys current session preserved in local storage
   */
  destroySession: async () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
    localStorage.setItem('logOut', new Date().toString());
    const currentUserUpdated = new CustomEvent('currentUserUpdated', { detail: undefined });
    window.dispatchEvent(currentUserUpdated);
    // api.removeAuthenticationHeader();
    clearTimeout(refreshTimeOut);
  },
  /**
   * Refreshes current session using refresh api
   */
  refreshSession: () => {
    // TODO: Implement refresh session depending upon backend implementation
  },
  /**
   * Authenticate if current path is allowed for current user role
   * @param path - string
   * returns true or alternate path
   */
  authenticateRoute: (path: string): boolean | string => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const currentUser = JSON.parse(user) as TCurrentUser;
      // if (!currentUser.user_role) session.destroySession();
      const currentRoute = routes.find((route) => path.match(new RegExp(route.path))) as Route;
      if (currentRoute) {
        return currentRoute.roles.some((role) => currentUser.role.role_id === role)
          ? true
          : currentUser.defaultRoute || '/';
      }
      return true;
    }
    return '/';
  },
  /**
   * Verifies current session by confirming if session token exists in local storage
   * Calls verifyAndUpdateUser to verify session
   * returns user
   */
  verifySession: (autoDestroy = true): Promise<TCurrentUser | boolean> => {
    const token = localStorage.getItem('sessionToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      api.setAuthenticationHeader(JSON.parse(token));
      // return JSON.parse(user);
      return session.verifyAndUpdateUser();
    }
    if (autoDestroy) session.destroySession();
    return Promise.resolve(false);
  },
  /**
   * Verifies if current session is still valid
   * Calls getCurrentUser to verify if current session is valid
   * If backend does not return 200 status destroys current session from local storage
   * returns user
   */
  verifyAndUpdateUser: async (sessionData?: SessionData): Promise<TCurrentUser | boolean> => {
    // console.log('verifyAndUpdateUser', userData);
    const { data: user, status } = await sharedApi.getCurrentUser(
      sessionData
        ? {
            'x-user-id': sessionData.id || '',
            'x-access-token': sessionData.token || '',
          }
        : undefined,
    );

    if (status !== 200) {
      session.destroySession();
      return Promise.resolve(false);
    }

    // validates and updates session token
    if (sessionData) {
      localStorage.setItem('sessionToken', JSON.stringify(sessionData));
      const sToken = {
        id: sessionData.id,
        token: sessionData.token,
      };
      localStorage.setItem('sessionToken', JSON.stringify(sToken));
      api.setAuthenticationHeader(sToken);
      localStorage.setItem('logIn', new Date().toString());
    }
    // Sets defaultRoute depending upon role id
    const defaultRoute = user.role.role_name === 'admin' ? '/admin/dashboard' : '/home';

    const updatedData = { ...user, defaultRoute };
    localStorage.setItem('currentUser', JSON.stringify(updatedData));
    const currentUserUpdated = new CustomEvent('currentUserUpdated', { detail: updatedData });
    window.dispatchEvent(currentUserUpdated);
    return updatedData;
  },
};

export default session;
