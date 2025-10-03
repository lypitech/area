import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  async configureWebhook(parameters: any) {
    const { repo, owner, callbackUrl, token } = parameters;

    const url = `https://api.github.com/repos/${owner}/${repo}/hooks`;

    const data = {
      name: 'web',
      active: true,
      events: ['push'],
      config: {
        url: callbackUrl,
        content_type: 'json',
      },
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to configure GitHub webhook: ${error.message}`);
    }
  }
}
