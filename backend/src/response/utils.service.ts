import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  constructor() {}

  getResult(template: string, payload: string): string {
    const json_payload: Record<string, any> = JSON.parse(payload);
    let result: string = '';
    let key: string = '';

    for (let i = 0; i < template.length; i++) {
      if (template[i] === '{') {
        key = template.substring(i + 1, template.indexOf('}', i));
        i += key.length + 2;
        result += json_payload[key] ?? `{${key}}`;
        continue;
      }
      result += template[i];
    }
    return result;
  }
}
