import { ReactionInstance } from 'src/response/schemas/response.schema';
import { ResponseCreationDto } from 'src/area/types/areaCreationDto';

export interface ResponseDriver {
  /*'service_name' */
  readonly key: string;
  supports(response: ResponseCreationDto): boolean;
  onCreate?(response: ResponseCreationDto): Promise<void>;
  onRemove?(response: ReactionInstance): Promise<void>;
  fire?(response: ReactionInstance, payload?: any): Promise<void>;
}
