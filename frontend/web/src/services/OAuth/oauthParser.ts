import { githubLogin } from "./OAuths/githubServices";

// Service name => string in LOWERCASE
// examples :
// Discord => "discord"
// Github => "github"

function OAuthParser(serviceName: string) {
    switch (serviceName) {
        case "Github":
            return githubLogin();
        case "Discord":
            return "none";
        default:
            return "unknown";
    }
}

export default OAuthParser;
