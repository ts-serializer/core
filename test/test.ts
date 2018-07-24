import {Deserializer} from '../lib/deserializer/deserializer';
import {Hero} from './hero';

const hero: Hero = new Hero();
hero.id = 1;
hero.firstName = 'Thomas';
hero.lastName = 'Nisole';
hero.weapons = 'weapons';
hero.city = 'My city';

const deserializer: Deserializer = new Deserializer();
const deserializedHero: any = deserializer.deserialize(hero);

console.log(deserializedHero);