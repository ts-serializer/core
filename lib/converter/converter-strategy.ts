import {Converter} from './converter';

export interface ConverterStrategy {

  getPriority(): number;

  canUseFor(type: {new(...args: any[]): Converter<any, any>}): boolean;

  getConverter(type: {new(...args: any[]): Converter<any, any>}): Converter<any, any>;
}
