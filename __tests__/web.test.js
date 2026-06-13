describe('WebJS Tests', () => {
    beforeAll(() => {
        // Load WebJS
        require('../src/web');
    });

    test('$$ is initialized', () => {
        expect(window.$$).toBeDefined();
        expect(global.$$).toBeDefined();
    });

    test('$$ has core methods', () => {
        expect(typeof window.$$.get).toBe('function');
        expect(typeof window.$$.set).toBe('function');
        expect(typeof window.$$.publish).toBe('function');
        expect(typeof window.$$.subscribe).toBe('function');
        expect(typeof window.$$.loadWidgets).toBe('function');
        expect(typeof window.$$.loadBackgroundImages).toBe('function');
    });
});
