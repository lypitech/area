function logout() {
  console.log("Logging out");
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}


function isLoggedIn() {
    return !!localStorage.getItem("access_token");
};

export { logout, isLoggedIn };