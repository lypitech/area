export class OauthDto {
  service_name: string;
  token: string;
  token_type?: string | null;
  refresh_token?: string | null;
  expires_at?: Date | null;
  meta?: Record<string, any>;
}
