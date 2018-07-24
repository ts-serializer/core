export function JsonProperty<T>(jsonPropertyContext: JsonPropertyContext<T>|string): any {
    function _jsonProperty(target: any, propertyKey: string, description: PropertyDescriptor) {
        if (target.hasOwnProperty(propertyKey)) {
            return;
        }

        target[propertyKey] = void 0;
    }

    return _jsonProperty;
}

export class JsonPropertyContext<T> {
    public name?: string;

    public type?: {new(): T};

    public customConverter?: {new(): T};

    public excludeToJson?: boolean
}
