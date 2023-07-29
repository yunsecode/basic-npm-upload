function isYunse(string) {
    return string === 'yunse';
}

function isNotYunse(string) {
    return string !== 'yunse';
}

function greet(name) {
    return `Hello, ${name}!`;
}

// 개별 함수들을 module.exports 객체의 프로퍼티로 할당
module.exports = {
    isYunse: isYunse,
    isNotYunse: isNotYunse,
    greet: greet
};
