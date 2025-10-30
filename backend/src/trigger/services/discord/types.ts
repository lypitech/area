export const discord_op = {
  HELLO: 10,
  HEARTBEAT: 11,
  DISPATCH: 0,
  RECONNECT: 7,
  INVALID: 9,
  IDENTIFY: 2,
};

export const discord_intents = {
  GUILDS: 1 << 0,
  GUILD_MESSAGE: 1 << 9,
  GUILD_MESSAGE_REACTION: 1 << 10,
  MESSAGE_CONTENT: 1 << 15,
};
