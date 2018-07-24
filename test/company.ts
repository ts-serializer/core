import {JsonProperty} from '../lib/decorator/json-property';

export class Company {

    @JsonProperty('id')
    public id: number;

    @JsonProperty('name')
    public name: string = 'default name';

    @JsonProperty('fullname')
    public get fullName(): string {
        return this.id + ' ' + this.name;
    }

    @JsonProperty('technicalname')
    public getTechnicalName(): string {
        return this.id + '/' + this.name;
    }
}
