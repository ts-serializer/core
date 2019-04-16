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

```
import {Serializer} from 'ts-serializer-core';

const serializer: Serializer = new Serialize();
...
```

The serializer accept two optionals arguments :

Argument | Type | Required | Description
---------|------|----------|------------
serializerConfiguration | SerializerConfiguration | False | The serializer configuration is use to configure the serializer
converterStrategies | ConverterStrategy[] | False | This array is used by serializer to know how to use your custom converter
