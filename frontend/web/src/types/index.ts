interface user {
    uuid: string;
    name: string;
    email: string;
    password: string;
    profile_picture: string;
    OAuth_id: string;
    Area: [string];
}

interface action {
    uuid: string;
    service_name: string;
    name: string;
    description: string;
}

interface reaction {
    uuid: string;
    service_name: string;
    name: string;
    description: string;
    schema_input: string;
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

export type { user, action, reaction, Area };