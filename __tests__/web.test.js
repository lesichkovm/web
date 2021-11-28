// const sum = require('./sum');
// function sum(a, b) {
//     return a + b;
//   }
// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

test('$$ is initialized', () => {
    require('../web'); // This module has a side-effect

    // Set up our document body
    // document.body.innerHTML =
    //   '<div>' +
    //   '  <span id="username" />' +
    //   '  <button id="button" />' +
    //   '</div>';
    //expect($$).toStrictEqual({});
    expect(typeof $$).toBe("object")
});