// Import custom commands
import './commands'

// Global before each hook
beforeEach(() => {
  // Clear authentication before each test
  cy.clearAuth();
});