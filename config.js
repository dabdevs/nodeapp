/**
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Stating environment (default)
environments.staging = {
  port: 6000,
  envName: "Staging",
};

// Production environment
environments.production = {
  port: 5000,
  envName: "Production",
};

// Select the environment
var currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Ensure the the currentEnvironment is in the list environments, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

// Export the module
module.exports = environmentToExport