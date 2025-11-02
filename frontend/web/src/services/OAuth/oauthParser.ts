import { githubLogin } from "./OAuths/githubServices";
import { twitchLogin } from "./OAuths/twitchServices";

// Service name => string in LOWERCASE
// examples :
// Discord => "discord"
// Github => "github"

function OAuthParser(serviceName: string) {
    switch (serviceName) {
        case "github":
            return githubLogin();
        case "twitch":
            return twitchLogin();
        default:
            return "unknown";
    }
}

export default OAuthParser;
