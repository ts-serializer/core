import {Converter} from './converter';

export interface ConverterStrategy {

  getConverter<T, R>(type: {new(): Converter<T, R>}): Converter<T, R>;
}
