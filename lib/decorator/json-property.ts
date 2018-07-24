export function JsonProperty<T>(jsonPropertyContext: JsonPropertyContext<T>|string): any {
    return (target: any, propertyKey: string) => {
        let metaData: JsonPropertyContext<T>;

        if (typeof jsonPropertyContext === 'string') {
            metaData = new JsonPropertyContext<T>();
            metaData.name = jsonPropertyContext;
        } else if (jsonPropertyContext instanceof JsonPropertyContext) {
            metaData = jsonPropertyContext;
        } else {
            throw new Error(`JsonPropertyContext is not correctly initialized : target : ${target} | property : ${propertyKey}`);
        }

        if (!target.hasOwnProperty(propertyKey)) {
            target[propertyKey] = void 0;
        }

        Reflect.defineMetadata('JsonProperty', metaData, target, propertyKey);
    };
}

export class JsonPropertyContext<T> {
    public name?: string;

    public type?: {new(): T};

    public customConverter?: {new(): T};

    public excludeToJson?: boolean
}
