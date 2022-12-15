import routes from './route-roles.json';
// eslint-disable-next-line import/no-cycle
import api from '../api/api.config';

export type UserSession = {
  first_name: string;
  last_name: string;
  roles: number[];
  user_role: {
    role_id: number;
    role_name: string;
  };
  user_id: number;
  defaultRoute: string;
  username: string;
};

export type SessionData = {
  id: string;
  token: string;
  username: string;
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
  createSession: (data: SessionData, userData: UserSession): Promise<UserSession> => {
    if (data.expiry) {
      const nextRefresh = (data.expiry - 60) * 1000;
      refreshTimeOut = setTimeout(async () => {
        // const response = await sharedApi.refreshSession();
        // if (response.status === 201) session.createSession(response.data);
      }, nextRefresh);
    }
    localStorage.setItem('logIn', new Date().toString());
    localStorage.setItem('sessionToken', JSON.stringify(data));
    api.setAuthenticationHeader(data);
    return session.verifyAndUpdateUser(userData);
  },
  /**
   * Gets current user session from local storage
   * returns user object if user exists else returns undefined
   */
  getCurrentSession: (): UserSession | undefined => {
    const user = localStorage.getItem('currentUser');
    if (user) return JSON.parse(user) as UserSession;
    return undefined;
  },
  /**
   * Checks if user is logged in or not
   * @returns UserSession | undefined
   */
  isLoggedIn: (): UserSession | undefined => {
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
      const currentUser = JSON.parse(user) as UserSession;
      // if (!currentUser.user_role) session.destroySession();
      const currentRoute = routes.find((route) => path.match(new RegExp(route.path))) as Route;
      if (currentRoute) {
        return currentRoute.roles.some((role) => currentUser.user_role.role_id === role)
          ? true
          : currentUser.defaultRoute;
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
  verifySession: (autoDestroy = true): Promise<UserSession | boolean> => {
    const token = localStorage.getItem('sessionToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      api.setAuthenticationHeader(JSON.parse(token));
      return JSON.parse(user);
      // return session.verifyAndUpdateUser();
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
  verifyAndUpdateUser: async (userData: UserSession): Promise<UserSession> => {
    console.log('verifyAndUpdateUser', userData);
    // TODO: check if session is still valid, can be any light api preferably a custom api
    // const { data: user, status } = await sharedApi.getCurrentUser();
    // if (status !== 200) {
    //   session.destroySession();
    //   return Promise.resolve(false);
    // }
    // Sets defaultRoute depending upon role id

    const updatedData = { ...userData, defaultRoute: '/home' };
    localStorage.setItem('currentUser', JSON.stringify(updatedData));
    return updatedData;
  },
};

export default session;
