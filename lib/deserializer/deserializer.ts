import {ConverterStrategy} from '../converter/converter-strategy';
import {InstantiateConverterStrategy} from '../converter/instantiate-converter-strategy';
import {JsonPropertyContext} from '../decorator/json-property';

export class Deserializer {

    public constructor(private converterStrategies: ConverterStrategy[]) {
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

    public deserialize(type: {new(): any}, data: any|any[]): any {
        if (type == null) {
            throw new Error('For deserialization of complex type, type attribute cannot be null in JsonProperty');
        }

        if (this.isArray(data)) {
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

            if (this.isArray(result[prop])) {
                result[prop] = result[prop].map((value: any) => {
                    if (propertyContext.customConverter) {
                        const converter: ConverterStrategy = this.converterStrategies.find(
                            (cs: ConverterStrategy) => cs.canUseFor(propertyContext.customConverter)
                        );

                        return converter ? converter.getConverter(propertyContext.customConverter).toJson(value) : null;
                    } else {
                        return !this.isPrimitive(value) ? this.deserialize(propertyContext.type, value) : value;
                    }
                });
            } else if (!this.isPrimitive(result[prop])) {
                if (propertyContext.customConverter) {
                    const converter: ConverterStrategy = this.converterStrategies.find(
                        (cs: ConverterStrategy) => cs.canUseFor(propertyContext.customConverter)
                    );
                    result[prop] = converter ? converter
                        .getConverter(propertyContext.customConverter)
                        .toJson(result[prop]) : null;
                } else {
                    result[prop] = this.deserialize(propertyContext.type, result[prop]);
                }
            }
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
