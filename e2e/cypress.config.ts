require('dotenv').config()

const { defineConfig } = require("cypress")

export default defineConfig({
  experimentalInteractiveRunEvents: true,
  env: {
    API_URL: "http://localhost:8888",
    OKTA_DOMAIN: "dev-75559375.okta.com",
    OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID,
    OKTA_USERNAME: process.env.OKTA_USERNAME,
    OKTA_PASSWORD: process.env.OKTA_PASSWORD,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins")(on, config)
    },
    baseUrl: "http://localhost:5173",
    defaultCommandTimeout: 10000,
  },
  viewportWidth: 1260,
  viewportHeight: 1000
})
