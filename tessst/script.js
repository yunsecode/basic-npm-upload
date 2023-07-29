// es6 `"type": "module"` in package.json,
// import { json_to_md } from "../minchopad"
// console.log("asd");
// import { isYunse, isNotYunse, greet } from "../minchopad";

// console.log(isYunse("yunse"));
// console.log(isNotYunse("yasdunse"));
// console.log(greet("yunse"));

// // CommonJs
const { jsonToMd } = require('minchopad'); // TypeScript 모듈을 JavaScript에서 require로 불러옴

const jsonData = {
  layout: 'post',
  title: 'My Blog Post',
  description: 'This is a blog post.',
  author: 'John Doe',
  date: '2023-07-29',
  category: 'Programming',
  tags: ['TypeScript', 'JavaScript'],
  aaaaa: "",
  body: 'This is the content of the blog post.',
};

const asd = [
    "aaaaa"
]

const outputPath = 'sample-post.md';


jsonToMd(jsonData, outputPath)
  .then(() => {
    console.log(`Content written successfully!`);
  })
  .catch((error) => {
    console.error(error.message);
  });

console.log("Asd");
// console.log(myModule.isYunse('yunse')); // true
// console.log(myModule.isNotYunse('hello')); // true
// console.log(myModule.greet('John')); // Hello, John!