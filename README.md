# TS-Serializer Core

[![Build Status](https://travis-ci.org/ts-serializer/core.svg?branch=master)](https://travis-ci.org/ts-serializer/core)
[![npm version](https://badge.fury.io/js/ts-serializer-core.svg)](https://badge.fury.io/js/ts-serializer-core)
![NPM](https://img.shields.io/npm/l/ts-serializer-core)
![GitHub repo size](https://img.shields.io/github/repo-size/ts-serializer/core)
![GitHub last commit](https://img.shields.io/github/last-commit/ts-serializer/core)
![GitHub issues](https://img.shields.io/github/issues/ts-serializer/core)
![GitHub top language](https://img.shields.io/github/languages/top/ts-serializer/core)

## Summary

* [Introduction](#introduction)
* [Installation](#installation)
* [How to use](#how-to-use)
    * [Serializer](#serializer)
    * [Deserializer](#deserializer)
    * [Serialization/Deserialization configuration](#serializationdeserialization-configuration)
* [API](#api)
    * [JsonProperty](#jsonproperty)

## Introduction

TS-Serializer Core is a library to manage serialization and deserialization in a Typescript program. It use decorator to configure serialization and deserialization.

## Installation

For installing core in Typescript Project with NPM, just run this command :

```shell script
npm i ts-serializer-core
```

## How to use

### Serializer

To use the serializer, you just have to instantiate an object of type ```Serializer```.

```typescript
import {Serializer} from 'ts-serializer-core';

const serializer: Serializer = new Serialize();
...
```

The serializer accept two arguments :

Argument | Type | Required | Description
---------|------|----------|------------
serializerConfiguration | SerializerConfiguration | False | The serializer configuration is use to configure the serializer
converterStrategies | ConverterStrategy[] | False | This array is used by serializer to know how to use your custom converter


### Deserializer

To use the deserializer, you just have to instantiate an object of type ```Deserializer```.

```typescript
import {Deserializer} from 'ts-deserializer-core';

const deserializer: Deserializer = new Deserialize();
...
```

The deserializer accept one argument :

Argument | Type | Required | Description
---------|------|----------|------------
converterStrategies | ConverterStrategy[] | False | This array is used by deserializer to know how to use your custom converter

### Serialization/Deserialization configuration

In this example, we configure models with simple and complex object/array type :

```typescript
import {JsonProperty} from 'ts-deserializer-core';

export class User {

    @JsonProperty('identifier')
    public id: number;

    @JsonProperty('lastName')
    public lastName: string;

    @JsonProperty('firstName')
    public firstName: string;
}

export class Hero extends User {

    @JsonProperty({name: 'weapons', type: Weapon})
    public weapons: Weapon[];

    @JsonProperty({name: 'animal', type: Animal})
    public animal: Animal;

    @JsonProperty('tags')
    public tags: string[];
}

export class Animal {

    @JsonProperty('id')
    public id: number;

    @JsonProperty('name')
    public name: string;

    public pv: number;
}

export class Weapon {

    @JsonProperty('id')
    public id: number;

    @JsonProperty('name')
    public name: string;
}
```

To use this configuration, we can run this code example :

```typescript
const hero: Hero = new Hero();
hero.id = 1;
hero.firstName = 'Thomas';
hero.lastName = 'Nisole';
hero.nickName = 'Tom';
hero.animal = new Animal();
hero.animal.id = 2;
hero.animal.name = 'Patrick';
hero.animal.pv = 51;
hero.tags = ['tag1', 'tag2'];

const weapon1 = new Weapon();
weapon1.id = 3;
weapon1.name = 'Sword';

const weapon2 = new Weapon();
weapon2.id = 4;
weapon2.name = 'shield';

hero.weapons = [weapon1, weapon2];

const serializer: Serializer = new Serializer(serializerConfiguration, [converterStrategy]);
console.log(serializer.serialize(hero));
```

The result is :

```json
{
    identifier: 1,
    firstName: 'Thomas',
    lastName: 'Nisole',
    animal: { id: 2, name: 'Patrick' },
    tags: [ 'tag1', 'tag2' ],
    weapons: [
        {
            id: 3,
            name: 'Sword'
        },
        {
            id: 4,
            name: 'shield'
        }
    ]
}
```

## API

### JsonProperty

| Attribute Name | Type | Mandatory | Description | 
| -------------- | ---- | --------- | ----------- |
| name | string  | Yes | The name or path field in the json data object |
| type | Type | No | The type for serialize/deserialize process to apply to the field |
| customConverter | Converter | A custom converter class to customize the serialize/deserialize process |
| excludeToJson | boolean | No | A boolean to exclude the field to the serialize json object |
| excludeFromJson | boolean | No | A boolean to not take care of the field from json object in the deserialization process |
