import { ReactionInstance } from 'src/response/schemas/response.schema';
import { ResponseCreationDto } from '../../types/responseCreationDto';

export interface ResponseDriver {
  /*'service_name' */
  readonly key: string;
  supports(response: ResponseCreationDto): boolean;
  onCreate?(response: ResponseCreationDto): Promise<void>;
  onRemove?(response: ReactionInstance): Promise<void>;
  fire?(response: ReactionInstance, payload?: any): Promise<void>;
}
