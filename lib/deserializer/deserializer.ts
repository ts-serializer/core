import {JsonPropertyContext} from '../decorator/json-property';

export class Deserializer {

    public constructor() {
    }

    public deserialize<T>(type: {new(): T}, data: any|any[]): T {
        if (this.isArray(data)) {
            return data.map((value: any) => this.deserialize(type, value));
        }

        let result = new type();
        for (const prop in result) {
            if (result[prop] instanceof Function) {
                continue;
            }

            if (!Reflect.hasMetadata('JsonProperty', result, prop)) {
                continue;
            }

            const propertyContext: JsonPropertyContext<any, any> = Reflect.getMetadata('JsonProperty', result, prop);

            result[prop] = data[propertyContext.name];
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