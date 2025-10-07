import { githubLogin } from "./OAuths/githubServices";

// Service name => string in LOWERCASE
// examples :
// Discord => "discord"
// Github => "github"

function OAuthParser(serviceName: string) {
    switch (serviceName) {
        case "github":
            return githubLogin();
        default:
            return "unknown";
    }
}

export default OAuthParser;
