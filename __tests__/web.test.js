// Mock window.location
const originalLocation = window.location;

describe('WebJS Tests', () => {
    beforeAll(() => {
        // Mock the global config
        global.APP_ID = 'test-app';
        global.WEBSITE_URL = 'http://example.com';
        global.API_URL = 'http://api.example.com';
        
        // Mock window.location
        delete window.location;
        window.location = {
            ...originalLocation,
            href: 'http://example.com?invoice_id=324&invoice_total=12.00',
            protocol: 'http:',
            hostname: 'example.com',
            port: '',
            search: '?invoice_id=324&invoice_total=12.00',
            host: 'example.com',
            origin: 'http://example.com'
        };
        
        // Load the module
        require('../src/web');
    });

    afterAll(() => {
        // Restore window.location
        window.location = originalLocation;
    });

    test('$$ is initialized', () => {
        expect(window.$$).toBeDefined();
        expect(window.$$).toBe(window.WebJS);
        expect(typeof $$).toBe('object');
    });

    test('$$ has get and set methods', () => {
        expect(typeof $$.get).toBe('function');
        expect(typeof $$.set).toBe('function');

        $$.set('TEST_KEY', 'TEST_VALUE');
        expect($$.get('TEST_KEY')).toBe('TEST_VALUE');
    });

    test('$$ has getAuthUser and setAuthUser methods', () => {
        expect(typeof $$.getAuthUser).toBe('function');
        expect(typeof $$.setAuthUser).toBe('function');

        $$.setAuthUser('TEST_USER_ID');
        expect($$.getAuthUser()).toBe('TEST_USER_ID');
    });

    test('$$ has getAuthToken and setAuthToken methods', () => {
        expect(typeof $$.getAuthToken).toBe('function');
        expect(typeof $$.setAuthToken).toBe('function');

        $$.setAuthToken('TEST_AUTH_TOKEN');
        expect($$.getAuthToken()).toBe('TEST_AUTH_TOKEN');
    });

    test('$$ has getLanguage and setLanguage methods', () => {
        expect(typeof $$.getLanguage).toBe('function');
        expect(typeof $$.setLanguage).toBe('function');

        $$.setLanguage('EN_GB');
        expect($$.getLanguage()).toBe('EN_GB');
    });

    test('$$ has getUrl methods', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://example.com',
                search: '',
                protocol: 'http:',
                hostname: 'example.com',
                port: '',
                host: 'example.com',
                origin: 'http://example.com'
            },
            writable: true
        });

        expect(typeof $$.getUrl).toBe('function');
        expect($$.getUrl()).toBe('http://example.com');
    });

    test('$$ has getUrlParam method', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://example.com?invoice_id=324',
                search: '?invoice_id=324&invoice_total=12.00',
                protocol: 'http:',
                hostname: 'example.com',
                port: '',
                host: 'example.com',
                origin: 'http://example.com'
            },
            writable: true
        });

        expect(typeof $$.getUrlParam).toBe('function');
        expect($$.getUrlParam('invoice_id')).toBe('324');
    });

    test('$$ has getUrlParams method', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://example.com?invoice_id=324',
                search: '?invoice_id=324&invoice_total=12.00',
                protocol: 'http:',
                hostname: 'example.com',
                port: '',
                host: 'example.com',
                origin: 'http://example.com'
            },
            writable: true
        });

        expect(typeof $$.getUrlParams).toBe('function');
        expect($$.getUrlParams()).toEqual({ invoice_id: '324', invoice_total: '12.00' });
    });

    test('$$ has to method', () => {
        delete window.location;
        window.location = {
            href: 'http://example.com?invoice_id=324',
            search: '?invoice_id=324&invoice_total=12.00',
            protocol: 'http:',
            hostname: 'example.com',
            port: '',
            host: 'example.com',
            origin: 'http://example.com',
            assign: jest.fn()
        };

        expect(typeof $$.to).toBe('function');
        
        // Test URL navigation
        $$.to('http://yahoo.com');
        expect(window.location.href).toBe('http://yahoo.com');
        
        // Test with target _blank
        document.body.innerHTML = `
            <div>
                <span id="username"></span>
                <button id="button"></button>
            </div>`;

        $$.to('http://google.com', {}, { target: '_blank' });
        expect(document.body.innerHTML).toContain('http://google.com');
        
        // Test relative URL
        $$.to('/auth');
        expect(window.location.href).toBe('http://example.com/auth');
    });

    test('$$ pubsub', (done) => {
        expect(typeof $$.publish).toBe('function');
        expect(typeof $$.subscribe).toBe('function');

        let topName = null;
        function world(topic, args) {
            topName = args;
            expect(topName).toBe('Tomas');
            done();
        }
        
        $$.subscribe('hello', world);
        const isPublished = $$.publish('hello', 'Tomas');
        expect(isPublished).toBe(true);
    });
});