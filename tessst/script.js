const { jsonToMd, createIndex } = require('minchopad'); // TypeScript 모듈을 JavaScript에서 require로 불러옴

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

// jsonToMd(jsonData, outputPath, asd)
//   .then(() => {
//     console.log(`Content written successfully!`);
//   })
//   .catch((error) => {
//     console.error("aaa error.message", error.message);
//   });
// ㅁㄴㅇㅁㄴㅇ
createIndex(["title", "aaaa"], "data/posts", "data/aa.json", false).catch((err) => {
  console.log(err);
})

console.log("Fin program");


/*
  에러 리스트

  파라미터 에러
  1. 파라미터 타입을 안 지키면
  2. 2번쨰 파라미터 directoryPath 가 존재하지 않거나 권한이 없으면
  3. 3번쨰 파라미터가 (권한으로 인해) 덮어 씌울 수 없는 파일, 아님 비여있으면

  디렉토리 에러
  1. 파일이 utf-8이 아니면


  읽을 수 없음
  1. 헤더가 ---시작하고 ---끝나지 않을 경우
*/