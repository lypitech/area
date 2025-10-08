import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
    ) {}
    async exchangeGithubCode(
        code: string,
        uuid: string
    ) {
        const client_id = process.env.GITHUB_CLIENT_ID;
        const client_secret = process.env.GITHUB_CLIENT_SECRET;

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: new URLSearchParams({
                client_id: client_id ?? '',
                client_secret: client_secret ?? '',
                code,
            }),
        });

        const tokenData = await tokenResponse.json();

        const accessToken = tokenData.access_token;
        if (!accessToken) {
            throw new Error('GitHub OAuth failed: no access token returned');
        }

        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        });

        const user = await userResponse.json();

        await this.userService.update(uuid, {
            githubToken: accessToken,
        });

        return { user, accessToken };
    }
}
