import {Converter} from './converter';

export class DateConverter implements Converter<Date, string> {

  public fromJson(value: string): Date {
    return new Date(value);
  }

  public toJson(value: Date): string {
    return value.toISOString();
  }
}
