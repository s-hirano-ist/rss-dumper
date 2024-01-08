const OpenAPISchemaValidator = require("openapi-schema-validator").default;
const apiDoc = require("../build/swagger.json");

const validator = new OpenAPISchemaValidator({
  version: 3,
  // optional
  extensions: {
    /* place any properties here to extend the schema. */
  },
});

console.log(validator.validate(apiDoc));
