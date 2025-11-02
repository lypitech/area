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

// To show available actions
interface ActionSelection {
  uuid: string;
  service_name: string;
  name: string;
  description: string;
  trigger_types: string;
}

// To show available reactions
interface ReactionSelection {
  uuid: string;
  service_name: string;
  name: string;
  description: string;
  schema_input: string; // JSON string
}

interface Action {
  uuid: string;
  service_name: string;
  name: string;
  every_minutes: number;
  description: string;
  area_uuid: string;
  service_resource_id: string | null;
  token: string;
  oauth_token_id: string | null;
  trigger_type: "webhook" | "polling" | "interval";
}

interface Reaction {
  uuid: string;
  service_name: string;
  name: string;
  service_resource_id: string | null;
  description: string;
  payload: string;
}

interface AreaHistory {
  timestamp: string;
  status: string;
}

interface Area {
  uuid: string;
  action_uuid: string;
  reaction_uuid: string;
  user_uuid: string;
  name: string;
  description: string;
  creation_date: string;
  enable: boolean;
  disabled_until: string;
  history: AreaHistory[];
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
  AreaHistory,
  ActionSelection,
  ReactionSelection,
  OAuth,
};
