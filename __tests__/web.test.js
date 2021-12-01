const oldWindowLocation = window.location

// beforeAll(() => {
//     delete window.location

//     window.location = Object.defineProperties(
//         {},
//         {
//             ...Object.getOwnPropertyDescriptors(oldWindowLocation),
//             href: {
//                 configurable: true,
//                 value: jest.fn(),
//             },
//         },
//     )
// })
// beforeEach(() => {
//     window.location.href.mockReset()
// })
// afterAll(() => {
//     // restore `window.location` to the original `jsdom`
//     // `Location` object
//     window.location = oldWindowLocation
// })

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

test('$$ has getUrl methods', () => {
    Object.defineProperty(window, "location", {
        value: {
            href: "http://example.com"
        },
        writable: true
    });

    expect(typeof $$.getUrl).toBe("function")

    expect($$.getUrl()).toBe("http://example.com")
});


test('$$ has getUrlParam method', () => {
    Object.defineProperty(window, "location", {
        value: {
            href: "http://example.com?invoice_id=324",
            search: "?invoice_id=324&invoice_total=12.00"
        },
        writable: true
    });

    expect(typeof $$.getUrlParam).toBe("function")

    expect($$.getUrlParam("invoice_id")).toBe("324")
});

test('$$ has getUrlParams method', () => {
    Object.defineProperty(window, "location", {
        value: {
            href: "http://example.com?invoice_id=324",
            search: "?invoice_id=324&invoice_total=12.00"
        },
        writable: true
    });

    expect(typeof $$.getUrlParams).toBe("function")

    expect($$.getUrlParams()).toEqual({ "invoice_id": "324", "invoice_total": "12.00" })
});

test('$$ has to method', () => {
    Object.defineProperty(window, "location", {
        value: {
            href: "http://example.com?invoice_id=324",
            search: "?invoice_id=324&invoice_total=12.00"
        },
        writable: true
    });

    expect(typeof $$.to).toBe("function")

    $$.to("http://yahoo.com")
    expect(window.location.href).toEqual("http://yahoo.com")



    document.body.innerHTML =
        '<div>' +
        '  <span id="username" />' +
        '  <button id="button" />' +
        '</div>';

    $$.to("http://google.com", {}, {
        target: "_blank"
    });

    expect(document.body.innerHTML).toContain("http://google.com")
});

test('$$ pubsub', () => {
    expect(typeof $$.publish).toBe("function")
    expect(typeof $$.subscribe).toBe("function")

    let topName = null
    function world(topic, args) {
        topName = args
    }
    $$.subscribe("hello", world)
    isPublished = $$.publish("hello", "Tomas")

    expect(isPublished).toEqual(true)
    setTimeout(function () {
        expect(topName).toEqual("Tomas")
    }, 4);
});