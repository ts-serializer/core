import {get} from 'lodash';
import {Converter} from '../converter/converter';
import {JsonPropertyContext} from '../decorator/json-property';
import {isArray} from '../util';
import {DeserializerConfiguration} from './deserializer-configuration';

export class Deserializer {

  public constructor(private deserializerConfiguration: DeserializerConfiguration = new DeserializerConfiguration()) {
  }

  public deserialize(type: new() => any, data: any | any[]): any {
    if (type == null) {
      throw new Error('For deserialization of complex type, type attribute cannot be null in JsonProperty');
    }

    if (data == null) {
      return null;
    }

    if (isArray(data)) {
      return data.map((value: any) => this.deserialize(type, value));
    }

    const result = new type();
    for (const prop in result) {
      if (!Reflect.hasMetadata('JsonProperty', result, prop)) {
        continue;
      }

      const propertyContext: JsonPropertyContext<any, any> = Reflect.getMetadata('JsonProperty', result, prop);
      if (propertyContext.excludeFromJson) {
        continue;
      }

      if (result[prop] instanceof Function) {
        throw new Error('JsonProperty annotation doesn\'t support function');
      }

      if (!this.deserializerConfiguration.deserializeUndefined && data[propertyContext.name] === undefined) {
        continue;
      }

      if (!this.deserializerConfiguration.deserializeNull && data[propertyContext.name] === null) {
        continue;
      }

      if (this.deserializerConfiguration.deserializeNull && data[propertyContext.name] === null) {
        result[prop] = null;
        continue;
      }

      result[prop] = get(data, propertyContext.name);

      if (isArray(result[prop])) {
        result[prop] = result[prop].map((value: any) => {
          if (propertyContext.customConverter) {
            const converter: Converter<any, any> = new propertyContext.customConverter();

            return converter.fromJson(value);
          } else if (propertyContext.type) {
            return this.deserialize(propertyContext.type, value);
          } else {
            return value;
          }
        });
      } else if (propertyContext.customConverter) {
        const converter: Converter<any, any> = new propertyContext.customConverter();
        result[prop] = converter.fromJson(result[prop]);
      } else if (propertyContext.type) {
        result[prop] = this.deserialize(propertyContext.type, result[prop]);
      }
    }

    return result;
  }
}
