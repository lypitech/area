export class OauthDto {
  service_name: string;
  token: string;
  refresh_token: string;
  token_type: string;
  expires_at: Date;
  meta?: {
    twitch_user_id?: string;
    twitch_login?: string;
    twitch_display_name?: string;
    profile_image_url?: string;
    [key: string]: any;
  };
}