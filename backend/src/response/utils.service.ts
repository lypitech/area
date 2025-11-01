import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  constructor() {}

  getResult(template: string, payload: Record<string, any>): string {
    let result: string = '';
    let keys: string[] = [];
    let key: string = '';

    for (let i = 0; i < template.length; i++) {
      if (template[i] === '{') {
        key = template.substring(i + 1, template.indexOf('}', i));
        keys = key.split('.');
        i += key.length + 1;
        const value: string | undefined = keys.reduce((obj, key) => obj[key], payload);
        result += value ?? `{${key}}`;
        continue;
      }
      result += template[i];
    }
    return result;
  }
}
