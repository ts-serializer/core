import {Converter} from './converter';
import {ConverterStrategy} from './converter-strategy';

export class InstantiateConverterStrategy implements ConverterStrategy {

  public getPriority(): number {
    return 1;
  }

  public canUseFor(type: {new(): Converter<any, any>}): boolean {
    return true;
  }

  public getConverter(type: {new(): Converter<any, any>}): Converter<any, any> {
    return new type();
  }
}
