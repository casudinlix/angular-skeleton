import { readFileSync } from 'node:fs';
const spec = JSON.parse(readFileSync('openapi/openapi.json', 'utf8'));
const customerTypes = readFileSync('src/app/features/customers/customer.types.ts', 'utf8');
const errors = [];
if (spec.openapi !== '3.1.0') errors.push('OpenAPI must be 3.1.0.');
const expected = {
  '/api/session': ['get','post','delete'],
  '/api/customers': ['get','post'],
  '/api/customers/{id}': ['get','patch','delete'],
};
for (const [path, methods] of Object.entries(expected)) {
  for (const method of methods) {
    if (!spec.paths?.[path]?.[method]) errors.push('Missing operation: ' + method.toUpperCase() + ' ' + path);
  }
}
const schemas = spec.components?.schemas ?? {};
for (const [name, shape] of Object.entries(schemas)) {
  if (shape.type === 'object' && shape.required) {
    for (const key of shape.required) {
      if (!Object.hasOwn(shape.properties ?? {}, key)) errors.push(name + ': missing required property ' + key);
    }
  }
}
const customer = schemas.Customer?.properties ?? {};
const customerInput = schemas.CustomerInput?.properties ?? {};
for (const key of Object.keys(customer)) {
  if (!new RegExp('readonly\\s+' + key + '\\s*:').test(customerTypes)) {
    errors.push('Customer TypeScript model missing OpenAPI field: ' + key);
  }
}
for (const key of Object.keys(customerInput)) {
  if (!new RegExp('readonly\\s+' + key + '\\s*:').test(customerTypes)) {
    errors.push('CustomerInput TypeScript model missing OpenAPI field: ' + key);
  }
}
if (!spec.components?.securitySchemes?.sessionCookie) errors.push('Missing cookie session security scheme.');
if (errors.length) { for (const issue of errors) console.error('Contract: ' + issue); process.exit(1); }
console.log('OpenAPI skeleton contract and TypeScript customer fields are aligned.');
