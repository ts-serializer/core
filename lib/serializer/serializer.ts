import 'reflect-metadata';
import {JsonPropertyContext} from '../decorator/json-property';
import {ConverterStrategy} from '../converter/converter-strategy';
import {SerializerConfiguration} from './serializer-configuration';

export class Serializer {

    public constructor(
      private serializerConfiguration: SerializerConfiguration,
      private converterStrategy: ConverterStrategy) {
    }

    public serialize(object: any|any[]): any {
        if (this.isArray(object)) {
            return object.map((value: any) => this.serialize(value));
        }

        let result: any = {};
        for (let prop in object) {
            if (!Reflect.hasMetadata('JsonProperty', object, prop)) {
                continue;
            }

            const propertyContext: JsonPropertyContext<any, any> = Reflect.getMetadata('JsonProperty', object, prop);

            if (propertyContext.excludeToJson) {
                continue;
            }

            let propertyValue;
            if (object[prop] instanceof Function) {
                propertyValue = object[prop]();
            } else {
                propertyValue = object[prop];
            }

            if (!this.serializerConfiguration.serializeNull && (propertyValue === null || propertyValue === undefined)) {
                continue;
            }

            if (this.serializerConfiguration.serializeNull && (propertyValue === null || propertyValue === undefined)) {
                result[propertyContext.name] = null;
                continue;
            }

            if (this.isArray(propertyValue)) {
                propertyValue = propertyValue.map((value: any) => {
                    if (propertyContext.customConverter) {
                        return this.converterStrategy.getConverter(propertyContext.customConverter).toJson(value);
                    } else {
                        return !this.isPrimitive(value) ? this.serialize(value) : value
                    }
                });
            } else if (!this.isPrimitive(propertyValue)) {
                if (propertyContext.customConverter) {
                  propertyValue = this.converterStrategy.getConverter(propertyContext.customConverter).toJson(propertyValue);
                } else {
                  propertyValue = this.serialize(propertyValue);
                }
            }

            result[propertyContext.name] = propertyValue
        }

        return result;
    }

    private isArray(obj: any): boolean {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    private isPrimitive(obj: any): boolean {
      return typeof obj  !== 'object';
    }
}