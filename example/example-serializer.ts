import {Hero} from './hero';
import {Serializer} from '../lib/serializer/serializer';
import {Animal} from './animal';
import {Weapon} from './weapon';
import {ConverterStrategy} from '../lib/converter/converter-strategy';
import {InstantiateConverterStrategy} from '../lib/converter/instantiate-converter-strategy';
import {SerializerConfiguration} from '../lib/serializer/serializer-configuration';

const hero: Hero = new Hero();
hero.id = 1;
hero.firstName = 'Thomas';
hero.lastName = 'Nisole';
hero.nickName = 'Tom';
hero.animal = new Animal();
hero.animal.id = 2;
hero.animal.name = 'Patrick';
hero.tags = ['tag1', 'tag2'];
hero.birthDay = new Date('December 17, 1995 03:24:00');
hero.fightDates = [new Date('December 18, 2000 03:24:00'), new Date('December 19, 2005 03:24:00')];

const weapon1 = new Weapon();
weapon1.id = 3;
weapon1.name = 'Sword';

const weapon2 = new Weapon();
weapon2.id = 4;
weapon2.name = 'shield';

hero.weapons = [weapon1, weapon2];


const serializerConfiguration = new SerializerConfiguration();
const converterStrategy: ConverterStrategy = new InstantiateConverterStrategy();

const serializer: Serializer = new Serializer(serializerConfiguration, converterStrategy);
console.log(serializer.serialize([hero]));

console.log();

serializerConfiguration.serializeNull = true;
console.log(serializer.serialize([hero]));
