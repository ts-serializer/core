import {set} from 'lodash';
import 'reflect-metadata';
import {Converter} from '../converter/converter';
import {JsonPropertyContext} from '../decorator/json-property';
import {isArray, isPrimitive} from '../util';
import {SerializerConfiguration} from './serializer-configuration';

export class Serializer {

  public constructor(private serializerConfiguration: SerializerConfiguration = new SerializerConfiguration()) {
  }

  public serialize(object: any | any[]): any {
    if (isArray(object)) {
      return object.map((value: any) => this.serialize(value));
    }

    const result: any = {};
    for (const prop in object) {
      if (!Reflect.hasMetadata('JsonProperty', object, prop)) {
        continue;
      }

      const propertyContext: JsonPropertyContext<any, any> = Reflect.getMetadata('JsonProperty', object, prop);

      if (propertyContext.excludeToJson) {
        continue;
      }

      let propertyValue;
      if (object[prop] instanceof Function) {
        throw new Error('JsonProperty annotation doesn\'t support function');
      }
      propertyValue = object[prop];

      if (!this.serializerConfiguration.serializeUndefined && propertyValue === undefined) {
        continue;
      }

      if (!this.serializerConfiguration.serializeNull && propertyValue === null) {
        continue;
      }

      if (this.serializerConfiguration.serializeNull && propertyValue === null) {
        result[propertyContext.name] = null;
        continue;
      }

      if (isArray(propertyValue)) {
        propertyValue = propertyValue.map((value: any) => {
          if (propertyContext.customConverter) {
            const converter: Converter<any, any> = new propertyContext.customConverter();

            return converter.toJson(value);
          } else {
            return !isPrimitive(value) ? this.serialize(value) : value;
          }
        });
      } else {
        if (propertyContext.customConverter) {
          const converter: Converter<any, any> = new propertyContext.customConverter();
          propertyValue = converter.toJson(propertyValue);
        } else if (!isPrimitive(propertyValue)) {
          propertyValue = this.serialize(propertyValue);
        }
      }

      set(result, propertyContext.name, propertyValue);
    }

    return result;
  }
}
