import getConfig from 'next/config';

import axios, {AxiosInstance} from 'axios';

let API: AxiosInstance;

const {serverRuntimeConfig} = getConfig();

const setupAPIClient = () => {
  API = axios.create({
    baseURL: serverRuntimeConfig.apiURL,
    withCredentials: true,
  });

  API.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        console.error(
          JSON.stringify({
            name: '[dashboard-api][error]',
            detail: error.response?.data,
          }),
        );
      } else {
        console.error('[error]', error);
      }

      return Promise.reject(error);
    },
  );

  return API;
};

export default setupAPIClient;
