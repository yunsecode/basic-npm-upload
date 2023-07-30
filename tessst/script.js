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
  test: 1
};

const asd = [
    "aaaaa",
    "fffff",
    "test"
]

const outputPath = 'sample-post.md';

jsonToMd(jsonData, outputPath, asd)
  .then(() => {
    console.log(`Content written successfully!`);
  })
  .catch((error) => {
    console.error("aaa error.message", error.message);
  });

console.log("Asd");
