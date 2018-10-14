export function isArray(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isPrimitive(obj: any): boolean {
    return typeof obj  !== 'object';
}
