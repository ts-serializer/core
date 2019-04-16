# TS-Serializer Core

[![Build Status](https://travis-ci.org/ts-serializer/core.svg?branch=master)](https://travis-ci.org/ts-serializer/core)

## Introduction

TS-Serializer Core is a library to manage serialization and deserialization in a Typescript program. It use decorator to configure serialization and deserialization.

## Installation

### With NPM
For installing core in Typescript Project with NPM, just run this command :

```javascript
npm install --save ts-serializer-core
```

### With Yarn
For installing core in Typescript Project with Yarn, just run this command :

```javascript
yarn add --save ts-serializer-core
```

## How to use

### Serializer

To use the serializer, you just have to instantiate an object of type ```Serializer```.

```javascript
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

```javascript
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

```javascript
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

```javascript
const hero: Hero = new Hero();
hero.id = 1;
hero.firstName = 'Thomas';
hero.lastName = 'Nisole';
hero.nickName = 'Tom';
hero.animal = new Animal();
hero.animal.id = 2;
hero.animal.name = 'Patrick';
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

```javascript

```