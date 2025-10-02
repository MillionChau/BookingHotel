const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    supportFile: './cypress/e2e/support/e2e.js', 
    setupNodeEvents(on, config) {
    },
  },
})