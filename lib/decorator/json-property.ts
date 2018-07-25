import 'reflect-metadata';
import {Converter} from '../converter/converter';

export function JsonProperty<T, R>(jsonPropertyContext: JsonPropertyContext<T, R>|string): any {
    return (target: any, propertyKey: string) => {
        let metaData: JsonPropertyContext<T, R>;

        if (typeof jsonPropertyContext === 'string') {
            metaData = new JsonPropertyContext<T, R>();
            metaData.name = jsonPropertyContext;
        } else if (typeof jsonPropertyContext  === 'object') {
            metaData = jsonPropertyContext;
        } else {
            throw new Error('JsonPropertyContext is not correctly initialized, JsonPropertyContext : ' + jsonPropertyContext);
        }

        if (!target.hasOwnProperty(propertyKey)) {
            target[propertyKey] = void 0;
        } else {
            const descriptor: any = Object.getOwnPropertyDescriptor(target, propertyKey);

            if (descriptor && (descriptor.set|| descriptor.get)) {
                throw new Error('JsonProperty annotation doesn\'t support getter/setter');
            }
        }

        Reflect.defineMetadata('JsonProperty', metaData, target, propertyKey);
    };
}

export class JsonPropertyContext<T, R> {
    public name?: string;

    public type?: {new(): T};

    public customConverter?: {new(): Converter<T, R>};

    public excludeToJson?: boolean
}
