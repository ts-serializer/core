import {Converter} from '../converter/converter';
import {ConverterStrategy} from '../converter/converter-strategy';
import {InstantiateConverterStrategy} from '../converter/instantiate-converter-strategy';
import {JsonPropertyContext} from '../decorator/json-property';
import {isArray} from '../util';
import {DeserializerConfiguration} from './deserializer-configuration';

export class Deserializer {

    public constructor(private deserializerConfiguration: DeserializerConfiguration,
                       private converterStrategies: ConverterStrategy[] = null) {
        if (!this.deserializerConfiguration) {
            this.deserializerConfiguration = new DeserializerConfiguration();
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

    public deserialize(type: {new(): any}, data: any|any[]): any {
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

            if (data[propertyContext.name] == null) {
                continue;
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

            result[prop] = data[propertyContext.name];

            if (isArray(result[prop])) {
                result[prop] = result[prop].map((value: any) => {
                    if (propertyContext.customConverter) {
                        const strategy: ConverterStrategy = this.getConverterStrategy(propertyContext.customConverter);

                        return strategy ? strategy
                            .getConverter(propertyContext.customConverter)
                            .fromJson(value) : null;
                    } else if (propertyContext.type) {
                        return this.deserialize(propertyContext.type, value);
                    } else {
                        return value;
                    }
                });
            } else if (propertyContext.customConverter) {
                const strategy: ConverterStrategy = this.getConverterStrategy(propertyContext.customConverter);
                result[prop] = strategy ? strategy
                    .getConverter(propertyContext.customConverter)
                    .fromJson(result[prop]) : null;
            } else if (propertyContext.type) {
                result[prop] = this.deserialize(propertyContext.type, result[prop]);
            }
        }

        return result;
    }

    public getConverterStrategy(converterType: {new(): Converter<any, any>}): ConverterStrategy {
        return this.converterStrategies.find(
            (cs: ConverterStrategy) => cs.canUseFor(converterType)
        );
    }
}
