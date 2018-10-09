import {Converter} from './converter';

export interface ConverterStrategy {

  getPriority(): number;

  canUseFor(type: {new(): Converter<any, any>}): boolean;

  getConverter(type: {new(): Converter<any, any>}): Converter<any, any>;
}
