import 'reflect-metadata';
import {Converter} from '../converter/converter';
import {ConverterStrategy} from '../converter/converter-strategy';
import {InstantiateConverterStrategy} from '../converter/instantiate-converter-strategy';
import {JsonPropertyContext} from '../decorator/json-property';
import {isArray, isPrimitive} from '../util';
import {SerializerConfiguration} from './serializer-configuration';

export class Serializer {

    public constructor(private serializerConfiguration: SerializerConfiguration,
                       private converterStrategies: ConverterStrategy[] = null) {
        if (!this.serializerConfiguration) {
            this.serializerConfiguration = new SerializerConfiguration();
        }

        if (!this.converterStrategies) {
            this.converterStrategies = [];
        }
        this.converterStrategies.push(new InstantiateConverterStrategy());

        if (this.converterStrategies.length > 1) {
            this.converterStrategies.sort(
                (csA: ConverterStrategy , csB: ConverterStrategy) => csB.getPriority() - csA.getPriority()
            );
        }
    }

    public serialize(object: any|any[]): any {
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
                        const strategy: ConverterStrategy = this.getConverterStrategy(propertyContext.customConverter);

                        return strategy ? strategy.getConverter(propertyContext.customConverter).toJson(value) : null;
                    } else {
                        return !isPrimitive(value) ? this.serialize(value) : value;
                    }
                });
            } else {
                if (propertyContext.customConverter) {
                    const strategy: ConverterStrategy = this.getConverterStrategy(propertyContext.customConverter);
                    propertyValue = strategy ? strategy
                        .getConverter(propertyContext.customConverter)
                        .toJson(propertyValue) : null;
                } else if (!isPrimitive(propertyValue)) {
                  propertyValue = this.serialize(propertyValue);
                }
            }

            result[propertyContext.name] = propertyValue;
        }

        return result;
    }

    public getConverterStrategy(converterType: {new(): Converter<any, any>}): ConverterStrategy {
        return this.converterStrategies.find(
            (cs: ConverterStrategy) => cs.canUseFor(converterType)
        );
    }
}
