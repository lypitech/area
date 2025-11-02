import { ReactionInstance } from '../schemas/response.schema';

export type DispatchReturn = {
  ok: boolean;
  error?: Error | string;
};

export type DispatchFunction = (
  reaction: ReactionInstance,
  payload: Record<string, any>,
) => Promise<DispatchReturn>;
