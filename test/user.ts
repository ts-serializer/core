import {JsonProperty} from '../lib/decorator/json-property';

export class User {

    @JsonProperty('id')
    public id: number;

    @JsonProperty('lastName')
    public lastName: string;

    @JsonProperty('firstName')
    public firstName: string;

    @JsonProperty('fullname')
    public get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    @JsonProperty('technicalname')
    public getTechnicalName(): string {
        return this.id + '/' + this.firstName + '/' + this.lastName;
    }
}
