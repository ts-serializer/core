export interface Converter<T, R> {

  toJson(value: T): R;

  fromJson(value: R): T;
}
