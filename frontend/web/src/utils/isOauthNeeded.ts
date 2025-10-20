const isOauthNeeded = (name: string): boolean => {
    switch (name) {
        case 'github':
            return localStorage.getItem('github_access_token') === null;
        default:
            return false;
    }
};

export { isOauthNeeded };