"use strict";
exports.__esModule = true;
var serializer_1 = require("../lib/serializer/serializer");
var company_1 = require("./user");
var company = new company_1.User(1, 'Orange');
var serializer = new serializer_1.Serializer();
console.log(serializer.serialize(company));
