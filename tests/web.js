// const add = require('../web.js');

function add(a, b) {
    return a + b;
}

QUnit.module('add');

QUnit.test('two numbers', assert => {
  assert.equal(add(1, 2), 3);
});