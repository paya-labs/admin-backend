// Vitest setup file
import { config } from '@vue/test-utils';

// Global test configuration
config.global.stubs = {
    // Stub router-link and router-view for component tests
    'router-link': true,
    'router-view': true,
};
