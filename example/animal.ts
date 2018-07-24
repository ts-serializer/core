import {JsonProperty} from '../lib/decorator/json-property';

export class Animal {

    @JsonProperty('id')
    public id: number;

    @JsonProperty('name')
    public name: string;

    public pv: number;
}