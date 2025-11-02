export const API_BASE_URL = import.meta.env.VITE_DEFAULT_API_URL;

export const API_ROUTES = {
  auth: {
    register: () => `${API_BASE_URL}/user/register`,
    login: () => `${API_BASE_URL}/user/login`,
    refresh: () => `${API_BASE_URL}/user/refresh`,
    logout: () => `${API_BASE_URL}/user/logout`,
    oauth: (service: string) => `${API_BASE_URL}/user/login/${service}`,
  },

  service: {
    get: () => `${API_BASE_URL}/services`,
  },

  actions: {
    getAll: () => `${API_BASE_URL}/actions`,
    getByUUID: (uuid: string) => `${API_BASE_URL}/actions/${uuid}`,
  },

  reactions: {
    getAll: () => `${API_BASE_URL}/reactions`,
    getByUUID: (uuid: string) => `${API_BASE_URL}/reactions/${uuid}`,
  },

  user: {
    getUser: (refreshToken: string) => `${API_BASE_URL}/users/getuser/${refreshToken}`,
  },

  area: {
    getAll: () => `${API_BASE_URL}/areas`,
    getAreaByUUID: (area_uuid: string) => `${API_BASE_URL}/areas/${area_uuid}`,
    getUserAreas: (uuid: string) => `${API_BASE_URL}/users/${uuid}/areas`,
    create: () => `${API_BASE_URL}/areas`,
    deleteAreaByUUID: (area_uuid: string) => `${API_BASE_URL}/areas/${area_uuid}`,
  },

  triggers: {
    get: (uuid: string, area_uuid: string) => `${API_BASE_URL}/users/${uuid}/areas/${area_uuid}/trigger`,
  },

  responses: {
    get: (uuid: string, area_uuid: string) => `${API_BASE_URL}/users/${uuid}/areas/${area_uuid}/response`,
  },

  oauth: {
    github: () => `${API_BASE_URL}/oauth/github`,
    twitch: () => `${API_BASE_URL}/oauth/twitch`,
  },
};
