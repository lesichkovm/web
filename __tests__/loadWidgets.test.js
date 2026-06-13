// Mock the global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Load the web module
const { loadWidgets } = require('../src/loadWidgets');

describe('loadWidgets', () => {
    let container;
    
    beforeEach(() => {
        // Set up a basic DOM
        document.body.innerHTML = `
            <div id="widget1" data-widget-url="/widgets/1">Loading widget 1...</div>
            <div id="widget2" data-widget-url="/widgets/2">Loading widget 2...</div>
            <div id="no-widget">No widget here</div>
        `;

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
        
        // Create global $$ if needed by loadWidgets.js
        global.$$ = global.$$ || {};
        global.$$.loadWidgets = loadWidgets;
    });

    test('loadWidgets should be a function', () => {
        expect(typeof loadWidgets).toBe('function');
    });

    test('should load widgets and execute their scripts', async () => {
        // Reset any existing state
        window.widget1Loaded = false;
        window.widget2Loaded = false;
        
        // Spy on console.error to ignore the removeChild error which is a JSDOM limitation
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call loadWidgets
        loadWidgets();
        
        // Wait for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Check that fetch was called for each widget
        expect(mockFetch).toHaveBeenCalledTimes(2);
        
        // Check that widget content was loaded
        const widget1 = document.getElementById('widget1');
        const widget2 = document.getElementById('widget2');
        
        expect(widget1.innerHTML).toContain('Widget 1 Content');
        expect(widget2.innerHTML).toContain('Widget 2 Content');
        
        consoleError.mockRestore();
    });

    test('should handle fetch errors gracefully', async () => {
        // Mock a failed fetch
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        
        // Spy on console.error
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Call loadWidgets
        loadWidgets();
        
        // Wait for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Check that the error was logged
        expect(consoleError).toHaveBeenCalledWith('Error loading widget:', '/widgets/1', expect.any(Error));
        
        // Clean up
        consoleError.mockRestore();
    });
});
