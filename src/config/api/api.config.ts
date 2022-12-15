import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-cycle
import session from '../session/session.config';
import { serverUrl } from '../variables/system.variable';

const BaseUrl = serverUrl;

let apiOptions: AxiosRequestConfig<unknown> = {};

function updateOptions(options: AxiosRequestConfig<unknown>) {
  return {
    ...apiOptions,
    ...options,
    headers: {
      ...apiOptions.headers,
      ...options.headers,
      ts: new Date().toISOString(),
    },
  };
}

function getApiUrl(url: string, apiUrl: string | boolean = false) {
  if (apiUrl) return `${apiUrl}/${url}`;
  return `${BaseUrl}/${url}`;
}

function errorHandler(error: { response: AxiosResponse }) {
  if (error.response.status === 401) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    api.removeAuthenticationHeader();
    session.destroySession();
    window.location.href = '/';
  }
  if (error.response) return error.response;
  return error;
}

const api = {
  get: (url: string, options: AxiosRequestConfig<unknown> = {}, apiUrl: string | boolean = false) =>
    axios.get(getApiUrl(url, apiUrl), updateOptions(options)).catch(errorHandler) as Promise<AxiosResponse>,
  post: (
    url: string,
    payload: unknown = {},
    options: AxiosRequestConfig<unknown> = {},
    apiUrl: string | boolean = false,
  ) =>
    axios.post(getApiUrl(url, apiUrl), payload, updateOptions(options)).catch(errorHandler) as Promise<AxiosResponse>,
  put: (url: string, payload = {}, options: AxiosRequestConfig<unknown> = {}, apiUrl: string | boolean = false) =>
    axios.put(getApiUrl(url, apiUrl), payload, updateOptions(options)).catch(errorHandler) as Promise<AxiosResponse>,
  delete: (url: string, options: AxiosRequestConfig<unknown> = {}, apiUrl: string | boolean = false) =>
    axios.delete(getApiUrl(url, apiUrl), updateOptions(options)).catch(errorHandler) as Promise<AxiosResponse>,
  setAuthenticationHeader: (tokenData: { token: string; id: string; username: string }) => {
    apiOptions = {
      headers: {
        'x-access-token': tokenData.token,
        'x-user-id': tokenData.id,
        'x-username': tokenData.username,
      },
    };
  },
  removeAuthenticationHeader: () => {
    apiOptions = {};
  },
};

export default api;
