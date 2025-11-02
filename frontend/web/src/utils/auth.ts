function clearLocalStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  clearAllServicesTokens();
  console.log("Local storage cleared");
}

function clearAllServicesTokens() {
  localStorage.removeItem("github_access_token");
  localStorage.removeItem("twitch_access_token");
}

function isLoggedIn() {
    return !!localStorage.getItem("access_token");
};

export { clearLocalStorage, isLoggedIn };
