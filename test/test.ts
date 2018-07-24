import {Company} from './company';
import {Deserializer} from '../lib/deserializer/deserializer';

console.log('start');
const company: Company = new Company();

const deserializer: Deserializer = new Deserializer();
console.log(deserializer.deserialize(company));

console.log('end');