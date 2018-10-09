import 'reflect-metadata';
import {ConverterStrategy} from '../converter/converter-strategy';
import {InstantiateConverterStrategy} from '../converter/instantiate-converter-strategy';
import {JsonPropertyContext} from '../decorator/json-property';
import {SerializerConfiguration} from './serializer-configuration';

export class Serializer {

    public constructor(
      private serializerConfiguration: SerializerConfiguration,
      private converterStrategies: ConverterStrategy[]) {
        if (!this.serializerConfiguration) {
            this.serializerConfiguration = new SerializerConfiguration();
        }

        if (!this.converterStrategies) {
            this.converterStrategies = [];
        }
        this.converterStrategies.push(new InstantiateConverterStrategy());

        this.converterStrategies.sort((csA: ConverterStrategy , csB: ConverterStrategy) => {
            if (csA.getPriority() < csB.getPriority()) {
                return -1;
            }
            if (csA.getPriority() > csB.getPriority()) {
                return 1;
            }

            return 0;
        });
    }

    public serialize(object: any|any[]): any {
        if (this.isArray(object)) {
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

            if (!this.serializerConfiguration.serializeNull
                && (propertyValue === null || propertyValue === undefined)) {
                continue;
            }

            if (this.serializerConfiguration.serializeNull
                && (propertyValue === null || propertyValue === undefined)) {
                result[propertyContext.name] = null;
                continue;
            }

            if (this.isArray(propertyValue)) {
                propertyValue = propertyValue.map((value: any) => {
                    if (propertyContext.customConverter) {
                        const converter: ConverterStrategy = this.converterStrategies.find(
                            (cs: ConverterStrategy) => cs.canUseFor(propertyContext.customConverter)
                        );

                        return converter ? converter.getConverter(propertyContext.customConverter).toJson(value) : null;
                    } else {
                        return !this.isPrimitive(value) ? this.serialize(value) : value;
                    }
                });
            } else if (!this.isPrimitive(propertyValue)) {
                if (propertyContext.customConverter) {
                    const converter: ConverterStrategy = this.converterStrategies.find(
                        (cs: ConverterStrategy) => cs.canUseFor(propertyContext.customConverter)
                    );
                    propertyValue = converter ? converter
                        .getConverter(propertyContext.customConverter)
                        .toJson(propertyValue) : null;
                } else {
                  propertyValue = this.serialize(propertyValue);
                }
            }

            result[propertyContext.name] = propertyValue;
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
