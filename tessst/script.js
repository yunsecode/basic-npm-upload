// es6 `"type": "module"` in package.json,
import { isYunse, isNotYunse, greet } from "is-yunse";

console.log(isYunse("yunse"));
console.log(isNotYunse("yasdunse"));
console.log(greet("yunse"));

// // CommonJs
// const myModule = require('is-yunse');

// console.log(myModule.isYunse('yunse')); // true
// console.log(myModule.isNotYunse('hello')); // true
// console.log(myModule.greet('John')); // Hello, John!