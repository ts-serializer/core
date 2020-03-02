import {Deserializer} from '../lib/deserializer/deserializer';
import {Hero} from './hero';
import {DeserializerConfiguration} from '../lib/deserializer/deserializer-configuration';

const data = {
  identifier: 1,
  firstName: 'Thomas',
  lastName: 'Nisole',
  nickname: 'tnisole',
  animal: {id: 2, name: 'Patrick'},
  tags: ['tag1', 'tag2'],
  birthDay: 'December 17, 1995 03:24:00',
  fightDates: ['December 18, 2000 03:24:00', 'December 19, 2005 03:24:00'],
  weapons: [{id: 3, name: 'Sword'}, {id: 4, name: 'shield'}],
  myPrivateProperty: 'hello'
};

const deserializerConfiguration = new DeserializerConfiguration();
const deserializer: Deserializer = new Deserializer(deserializerConfiguration);
console.log(deserializer.deserialize(Hero, data));
