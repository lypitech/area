export const API_BASE_URL = "http://localhost:8080";

export const API_ROUTES = {
  auth: {
    register: `${API_BASE_URL}/login/register`,
    login: `${API_BASE_URL}/login`,
    refresh: `${API_BASE_URL}/login/refresh`,
    logout: `${API_BASE_URL}/login/logout`,
  },

  list: {
    actions: `${API_BASE_URL}/list/actions`,
    reactions: `${API_BASE_URL}/list/reactions`,
  },

  user: {
    getUser: `${API_BASE_URL}/users/getuser`,
  }
};
