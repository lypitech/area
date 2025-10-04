export const API_BASE_URL = "http://localhost:8080";

export const API_ROUTES = {
  auth: {
    register: `${API_BASE_URL}/login/register`,
    login: `${API_BASE_URL}/login`,
    refresh: `${API_BASE_URL}/login/refresh`,
  },
};
