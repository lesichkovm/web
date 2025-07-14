// Mock the DOM environment
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Mock the global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('loadWidgets', () => {
    let dom;
    let container;
    
    beforeEach(() => {
        // Set up a basic DOM
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <div id="widget1" data-widget-url="/widgets/1">Loading widget 1...</div>
                    <div id="widget2" data-widget-url="/widgets/2">Loading widget 2...</div>
                    <div id="no-widget">No widget here</div>
                </body>
            </html>
        `);

        global.document = dom.window.document;
        global.window = dom.window;
        
        // Reset mocks
        mockFetch.mockClear();
        
        // Mock fetch to return widget HTML
        mockFetch.mockImplementation((url) => {
            const widgetId = url.split('/').pop();
            return Promise.resolve({
                text: () => Promise.resolve(`
                    <div class="widget-content">Widget ${widgetId} Content</div>
                    <script>window.widget${widgetId}Loaded = true;</script>
                `)
            });
        });
        
        // Load the web module
        require('../src/web');
    });

    afterEach(() => {
        // Clean up
        delete global.document;
        delete global.window;
    });

    test('$$.loadWidgets should be a function', () => {
        expect(typeof $$.loadWidgets).toBe('function');
    });

    test('should load widgets and execute their scripts', async () => {
        // Reset any existing state
        window.widget1Loaded = false;
        window.widget2Loaded = false;
        
        // Mock document.head.appendChild to capture script execution
        const originalAppendChild = document.head.appendChild;
        const appendSpy = jest.spyOn(document.head, 'appendChild');
        
        // Call loadWidgets
        $$.loadWidgets();
        
        // Wait for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Check that fetch was called for each widget
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledWith('/widgets/1');
        expect(mockFetch).toHaveBeenCalledWith('/widgets/2');
        
        // Check that widget content was loaded
        const widget1 = document.getElementById('widget1');
        const widget2 = document.getElementById('widget2');
        
        expect(widget1.innerHTML).toContain('Widget 1 Content');
        expect(widget2.innerHTML).toContain('Widget 2 Content');
        
        // Check that scripts were executed
        // Since we're in a test environment, we'll check if the appendChild was called with our script
        const scriptCalls = appendSpy.mock.calls.filter(
            call => call[0].tagName === 'SCRIPT' && call[0].text.includes('widget')
        );
        expect(scriptCalls.length).toBeGreaterThan(0);
        
        // Clean up
        appendSpy.mockRestore();
    });

    test('should handle fetch errors gracefully', async () => {
        // Mock a failed fetch
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        
        // Spy on console.error
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call loadWidgets
        $$.loadWidgets();
        
        // Wait for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Check that the error was logged
        expect(consoleError).toHaveBeenCalledWith('Error loading widget:', '/widgets/1', expect.any(Error));
        
        // Clean up
        consoleError.mockRestore();
    });
});
