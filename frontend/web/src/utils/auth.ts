function clearLocalStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("github_access_token");
  console.log("Local storage cleared");
}

function isLoggedIn() {
    return !!localStorage.getItem("access_token");
};

export { clearLocalStorage, isLoggedIn };