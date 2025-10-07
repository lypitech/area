export const API_BASE_URL = "http://localhost:8080";

export const API_ROUTES = {
  auth: {
    register: `${API_BASE_URL}/login/register`,
    login: `${API_BASE_URL}/login`,
    refresh: `${API_BASE_URL}/login/refresh`,
    logout: `${API_BASE_URL}/login/logout`,
  },

  selection: {
    actions: `${API_BASE_URL}/action/list`,
    reactions: `${API_BASE_URL}/reaction/list`,
  },

  user: {
    getUser: `${API_BASE_URL}/users/getuser`,
  }
};
