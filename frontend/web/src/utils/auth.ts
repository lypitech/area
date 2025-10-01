function logout() {
    localStorage.removeItem("token");
};

function isLoggedIn() {
    return !!localStorage.getItem("token");
};

export { logout, isLoggedIn };