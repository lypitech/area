interface User {
  uuid: string;
  nickname: string;
  username: string; // lowercase, numbers, '_'
  password: string;
  email: string; // email format
  profile_picture: string | null; // URL
  OAuth_id: string | null; // UUID
  Area: string[];
}

type TriggerType = 'webhook' | 'polling' | 'interval';
// The names of the interfaces will be the name of the class

interface Service {
  uuid: string;
  name: string;
  actions: Action[];
  reactions: Reaction[];
}

interface Action {
  uuid?: string;
  service_name: string;
  name: string;
  description: string;
  trigger_types: TriggerType[];
  parameters: Array<{
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    [key: string]: any;
  }>;
}

interface Trigger {
  uuid: string;
  service_name: string;
  name: string;
  description: string;
  resource_id: string;
  oauth_token: string; // Recovered automatically if not given
}

interface Reaction {
	uuid: string;
	service_name: string;
	name: string;
	description: string;
	schema_input: Record<string, any>; // => json
}

interface Response { // The real name of the class is ReactionInstance to avoid http Response collision
  uuid: string;
  service_name: string;
  name: string;
  description: string;
  oauth_token: string;
  resource_id: string;
  payload: string;
}

interface Area {
  uuid: string;
  trigger_uuid: string;
  response_uuid: string;
  user_uuid: string;
  name: string;
  description?: string;
  enabled: boolean;                    // défaut: true
  disabled_until?: string | null;     // ISO ou null
  history: Array<{ timestamp: string; status: string }>;
  createdAt: string;
  updatedAt: string;
}

interface OAuth {
  uuid: string;
  service_name: string;
  token: string;
}

export type {
  User,
  Action,
  Reaction,
  Area,
  Trigger,
  Response,
  OAuth,
  Service
};
