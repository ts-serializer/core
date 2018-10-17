import {ConverterStrategy} from '../converter/converter-strategy';
import {InstantiateConverterStrategy} from '../converter/instantiate-converter-strategy';
import {JsonPropertyContext} from '../decorator/json-property';
import {isArray} from '../util';

export class Deserializer {

    public constructor(private converterStrategies: ConverterStrategy[]) {
        if (!this.converterStrategies) {
            this.converterStrategies = [];
        }
        this.converterStrategies.push(new InstantiateConverterStrategy());

        if (this.converterStrategies.length > 1) {
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

            result[prop] = data[propertyContext.name];

            if (isArray(result[prop])) {
                result[prop] = result[prop].map((value: any) => {
                    if (propertyContext.customConverter) {
                        const converter: ConverterStrategy = this.converterStrategies.find(
                            (cs: ConverterStrategy) => cs.canUseFor(propertyContext.customConverter)
                        );

                        return converter ? converter.getConverter(propertyContext.customConverter).fromJson(value) : null;
                    } else if (propertyContext.type) {
                        return this.deserialize(propertyContext.type, value);
                    } else {
                        return value;
                    }
                });
            } else {
                if (propertyContext.customConverter) {
                    const converter: ConverterStrategy = this.converterStrategies.find(
                        (cs: ConverterStrategy) => cs.canUseFor(propertyContext.customConverter)
                    );
                    result[prop] = converter ? converter
                        .getConverter(propertyContext.customConverter)
                        .fromJson(result[prop]) : null;
                } else if (propertyContext.type) {
                    result[prop] = this.deserialize(propertyContext.type, result[prop]);
                }
            }
        }

        return result;
    }
}
