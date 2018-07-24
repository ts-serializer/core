import 'reflect-metadata';
import {JsonPropertyContext} from '../decorator/json-property';

export class Serializer {

    public constructor() {

    }

    public serialize(object: any): any {
        let result: any = {};

        let prop: string;
        for (prop in object) {
            if (!Reflect.hasMetadata('JsonProperty', object, prop)) {
                continue;
            }

            const propertyContext: JsonPropertyContext<any> = Reflect.getMetadata('JsonProperty', object, prop);

            if (object[prop] instanceof Function) {
                result[propertyContext.name] = object[prop]();
            } else {
                result[propertyContext.name] = object[prop];
            }
        }

        return result;
    }
}