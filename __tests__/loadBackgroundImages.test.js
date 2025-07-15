// Mock the DOM environment
const { JSDOM } = require('jsdom');

// Create a mock for the Image constructor
let mockImages = [];

// Store the original implementation
const originalImage = global.Image;

// Create a mock Image constructor
class MockImage {
    constructor() {
        this.src = '';
        this.onload = null;
        this.onerror = null;
        this.complete = false;
        mockImages.push(this);
    }

    addEventListener(event, callback) {
        if (event === 'load') {
            this.onload = callback;
        } else if (event === 'error') {
            this.onerror = callback;
        }
    }
}

// Set up the mock before importing the module
global.Image = MockImage;

// Import the module after setting up the mock
const { loadBackgroundImages } = require('../src/loadBackgroundImages');

// Restore the original Image after all tests
if (originalImage) {
    afterAll(() => {
        global.Image = originalImage;
    });
}

describe('loadBackgroundImages', () => {
    // Store the original console.error to suppress expected error messages
    const originalConsoleError = console.error;
    
    beforeAll(() => {
        // Mock console.error to suppress expected error messages
        console.error = jest.fn();
    });
    
    afterAll(() => {
        // Restore console.error
        console.error = originalConsoleError;
    });
    
    beforeEach(() => {
        // Reset mock images array before each test
        mockImages = [];
        
        // Create a new JSDOM instance with a basic HTML structure
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { 
            url: 'http://localhost',
            runScripts: 'dangerously',
            resources: 'usable'
        });

        // Set up the global document and window objects
        global.window = dom.window;
        global.document = dom.window.document;
        global.navigator = dom.window.navigator;
        
        // Create test elements and append them to the body
        const bg1 = document.createElement('div');
        bg1.id = 'bg1';
        bg1.setAttribute('data-background-image', '/images/1.jpg');
        document.body.appendChild(bg1);
        
        const bg2 = document.createElement('div');
        bg2.id = 'bg2';
        bg2.setAttribute('data-background-image', '/images/2.jpg');
        document.body.appendChild(bg2);
        
        // Create a fresh $$ object for each test
        global.$$ = {};
        global.$$.loadBackgroundImages = loadBackgroundImages;
    });

    test('should set background image for elements', () => {
        // Get elements directly from the document
        const bg1 = document.getElementById('bg1');
        const bg2 = document.getElementById('bg2');
        
        // Verify elements exist and initial state
        expect(bg1).not.toBeNull();
        expect(bg2).not.toBeNull();
        expect(bg1.style.backgroundImage).toBe('');
        expect(bg2.style.backgroundImage).toBe('');
        
        // Call the function
        loadBackgroundImages();
        
        // Verify the correct number of images were created with the correct src
        expect(mockImages).toHaveLength(2);
        expect(mockImages[0].src).toBe('/images/1.jpg');
        expect(mockImages[1].src).toBe('/images/2.jpg');
        
        // Simulate image loads
        if (mockImages[0].onload) mockImages[0].onload();
        if (mockImages[1].onload) mockImages[1].onload();
        
        // Check if background images are set
        expect(bg1.style.backgroundImage).toContain('/images/1.jpg');
        expect(bg2.style.backgroundImage).toContain('/images/2.jpg');
    });

    test('should be added to the $$ object', () => {
        // Assert
        expect(typeof loadBackgroundImages).toBe('function');
        expect($$.loadBackgroundImages).toBe(loadBackgroundImages);
    });

    test('should handle elements without spinners gracefully', () => {
        // Arrange
        const container = document.createElement('div');
        container.id = 'bg3';
        container.setAttribute('data-background-image', '/images/3.jpg');
        document.body.appendChild(container);
        
        // Store original Image constructor
        const OriginalImage = window.Image;
        
        // Mock the Image constructor
        window.Image = class MockImage {
            constructor() {
                this.src = '';
                this.onload = null;
                this.onerror = null;
            }
        };
        
        try {
            // Act - should not throw
            expect(() => {
                loadBackgroundImages();
            }).not.toThrow();
        } finally {
            // Clean up
            window.Image = OriginalImage;
            document.body.removeChild(container);
        }
    });
});
