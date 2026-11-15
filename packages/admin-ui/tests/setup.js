// Vitest setup file
import { config } from '@vue/test-utils';

// Global test configuration
config.global.stubs = {
    // Stub router-link and router-view for component tests
    'router-link': true,
    'router-view': true,
};

// Node 25 ships its own `localStorage` global, which shadows jsdom's and has
// no `clear()`/`getItem()` unless Node is started with a storage file. Give
// the tests an in-memory Storage instead.
if (typeof globalThis.localStorage?.clear !== 'function') {
    const store = new Map();
    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: {
            getItem: (key) => (store.has(key) ? store.get(key) : null),
            setItem: (key, value) => store.set(key, String(value)),
            removeItem: (key) => store.delete(key),
            clear: () => store.clear(),
            key: (i) => [...store.keys()][i] ?? null,
            get length() {
                return store.size;
            },
        },
    });
}
