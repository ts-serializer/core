import {Converter} from './converter';
import {ConverterStrategy} from './converter-strategy';

export class InstantiateConverterStrategy implements ConverterStrategy {

  public getConverter<T, R>(type: {new(): Converter<T, R>}): Converter<T, R> {
    return new type();
  }
}
