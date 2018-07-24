import {User} from './user';
import {JsonProperty} from '../lib/decorator/json-property';

export class Hero extends User {

    @JsonProperty('city')
    public city: string;

    @JsonProperty('weapons')
    public weapons: string;

    @JsonProperty('fullAddress')
    public get fullAddress(): string {
        return 'it is my address : ' + this.id + '/' + this.city;
    }

    @JsonProperty('getWeapons')
    public getWeapons(): string {
        return 'it is my weapons ' + this.weapons;
    }
}