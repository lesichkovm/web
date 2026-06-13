// Setup file for Jest tests
// This file runs before each test file

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock any global objects needed for testing
global.$$ = {};

// Mock the Image constructor
global.Image = class {
  constructor() {
    this.src = '';
    this.onload = null;
    this.onerror = null;
    this.addEventListener = (event, callback) => {
      if (event === 'load') this.onload = callback;
      if (event === 'error') this.onerror = callback;
    };
  }
};
