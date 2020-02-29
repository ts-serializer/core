import {JsonProperty} from '../lib/decorator/json-property';

export class User {

  @JsonProperty('identifier')
  public id: number;

  @JsonProperty('lastName')
  public lastName: string;

  @JsonProperty('firstName')
  public firstName: string;

  @JsonProperty({excludeToJson: true})
  public nickName: string;

  public getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public getDescription(): string {
    return this.id + ' : ' + this.firstName + ' - ' + this.lastName;
  }
}
