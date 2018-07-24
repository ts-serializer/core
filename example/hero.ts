import {User} from './user';
import {JsonProperty} from '../lib/decorator/json-property';
import {Weapon} from './weapon';
import {Animal} from './animal';
import {DateConverter} from '../lib/converter/date-converter';

export class Hero extends User {

    @JsonProperty('city')
    public city: string;

    @JsonProperty({name: 'weapons'})
    public weapons: Weapon[];

    @JsonProperty({name: 'animal'})
    public animal: Animal;

    @JsonProperty('tags')
    public tags: string[];

    @JsonProperty({name: 'birthDay', customConverter: DateConverter})
    public birthDay: Date;

    @JsonProperty({name: 'fightDates', customConverter: DateConverter})
    public fightDates: Date[];

    @JsonProperty('fullAddress')
    public get fullAddress(): string {
        return 'it is my address : ' + this.id + '/' + this.city;
    }

    @JsonProperty('getWeapons')
    public getWeapons(): string {
        return 'my weapons';
    }

    @JsonProperty('descriptionHero')
    public getDescription(): string {
      return this.id + ' : ' + this.firstName + ' - ' + this.lastName + ' / Animal : ' + this.animal.id + ' - ' + this.animal.name;
    }
}