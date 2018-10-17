import {User} from './user';
import {JsonProperty} from '../lib/decorator/json-property';
import {Weapon} from './weapon';
import {Animal} from './animal';
import {DateConverter} from '../lib/converter/date-converter';

export class Hero extends User {

  @JsonProperty({name: 'weapons', type: Weapon})
  public weapons: Weapon[];

  @JsonProperty({name: 'animal', type: Animal})
  public animal: Animal;

  @JsonProperty('tags')
  public tags: string[];

  @JsonProperty({name: 'birthDay', customConverter: DateConverter})
  public birthDay: Date;

  @JsonProperty({name: 'fightDates', customConverter: DateConverter})
  public fightDates: Date[];

  private _myPrivateProperty: string;

  private _myDatePrivateProperty: Date;

  public getWeapons(): string {
    return 'my weapons';
  }

  public getDescription(): string {
    return this.id + ' : ' + this.firstName + ' - ' + this.lastName + ' / Animal : ' + this.animal.id + ' - ' + this.animal.name;
  }

  public get monGetter(): string {
    return 'monGetter';
  }

  public set monSetter(value: string) {
  }

  public getMyPrivateProperty(): string {
      return this._myPrivateProperty;
  }

  public setMyPrivateProperty(value: string): void {
    this._myPrivateProperty = value;
  }

  public getMyDatePrivateProperty(): Date {
    return this._myDatePrivateProperty;
  }

  public setMyDatePrivateProperty(value: Date): void {
    this._myDatePrivateProperty = value;
  }
}