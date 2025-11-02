export class OauthDto {
  service_name: string;
  token: string;
  refresh_token: string;
  token_type: string;
  expires_at: Date;
  meta?: Record<string, any>;
}
