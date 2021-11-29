const oldWindowLocation = window.location

beforeAll(() => {
  delete window.location

  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      assign: {
        configurable: true,
        value: jest.fn(),
      },
    },
  )
})
afterAll(() => {
  // restore `window.location` to the original `jsdom`
  // `Location` object
  window.location = oldWindowLocation
})

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


test('$$ has get and set methods', () => {
    require('../web'); // This module has a side-effect
    expect(typeof $$.get).toBe("function")
    expect(typeof $$.set).toBe("function")

    $$.set("TEST_KEY", "TEST_VALUE");
    expect($$.get("TEST_KEY")).toBe("TEST_VALUE")
});

test('$$ has getAuthUser and setAuthUser methods', () => {
    require('../web'); // This module has a side-effect
    expect(typeof $$.getAuthUser).toBe("function")
    expect(typeof $$.setAuthUser).toBe("function")

    $$.setAuthUser("TEST_USER_ID");
    expect($$.getAuthUser()).toBe("TEST_USER_ID")
});

test('$$ has getAuthToken and setAuthToken methods', () => {
    require('../web'); // This module has a side-effect
    expect(typeof $$.getAuthToken).toBe("function")
    expect(typeof $$.setAuthToken).toBe("function")

    $$.setAuthToken("TEST_AUTH_TOKEN");
    expect($$.getAuthToken()).toBe("TEST_AUTH_TOKEN")
});

test('$$ has getLanguage and setLanguage methods', () => {
    require('../web'); // This module has a side-effect
    expect(typeof $$.getLanguage).toBe("function")
    expect(typeof $$.setLanguage).toBe("function")

    $$.setLanguage("EN_GB");
    expect($$.getLanguage()).toBe("EN_GB")
});

// test('$$ has getUrl methods', () => {
//     // global.window = { location: { href: "http://example.com" } };
//     // Object.assign(location, { host: "www.newhost.com", pathname: 'file.txt', href: "http://example.com"});
//     window.location.assign('http://example.com')
//     require('../web'); // This module has a side-effect
//     expect(typeof $$.getUrl).toBe("function")

//     // window.location.href = "http://example.com";
//     // console.log(window.location.href)
//     // window.location.assign('http://example.com')

//     expect($$.getUrl()).toBe("http://example.com")
// });