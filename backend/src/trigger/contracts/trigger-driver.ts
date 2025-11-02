import { Trigger, TriggerType } from '../schemas/trigger.schema';

export interface TriggerDriver {
  /** Un identifiant libre, ex: 'github:webhook', 'area:interval' */
  readonly key: string;
  supports(trigger: Trigger): boolean;
  onCreate?(trigger: Trigger, params?: Record<string, any>): Promise<void>;
  onRemove?(trigger: Trigger): Promise<void>;
  fire?(trigger: Trigger, payload?: any): Promise<void>;
}
