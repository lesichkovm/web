/**
 * Utility to mock window.location in JSDOM
 */
function mockLocation(overrides) {
  const originalLocation = window.location;
  delete window.location;
  window.location = {
    ...originalLocation,
    ...overrides,
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    toString: () => overrides.href || originalLocation.href
  };
  return originalLocation;
}

function restoreLocation(originalLocation) {
  delete window.location;
  window.location = originalLocation;
}

module.exports = { mockLocation, restoreLocation };
