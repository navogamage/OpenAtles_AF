// my-app/src/Test/setup.cjs
const { configure } = require('@testing-library/react');

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Setup mock for ResizeObserver which isn't available in JSDOM
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock for window.matchMedia which isn't available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup any other global mocks or configuration needed for tests