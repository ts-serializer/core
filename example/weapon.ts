import {JsonProperty} from '../lib/decorator/json-property';

export class Weapon {

  @JsonProperty('id')
  public id: number;

  @JsonProperty('name')
  public name: string;
}
