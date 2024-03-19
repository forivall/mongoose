'use strict';

module.exports = applyEmbeddedDiscriminators;

function applyEmbeddedDiscriminators(schema, seen = new WeakSet()) {
  if (seen.has(schema)) {
    return;
  }
  seen.add(schema);
  for (const path of Object.keys(schema.paths)) {
    const schemaType = schema.paths[path];
    if (!schemaType.schema) {
      continue;
    }
    applyEmbeddedDiscriminators(schemaType.schema, seen);
    if (!schemaType.schema._applyDiscriminators) {
      continue;
    }
    if (schemaType._appliedDiscriminators) {
      continue;
    }
    for (const discriminatorKey of schemaType.schema._applyDiscriminators.keys()) {
      const discriminatorSchema = schemaType.schema._applyDiscriminators.get(discriminatorKey);
      applyEmbeddedDiscriminators(discriminatorSchema[0], seen);
      schemaType.discriminator(discriminatorKey, discriminatorSchema[0], discriminatorSchema[1]);
    }
    schemaType._appliedDiscriminators = true;
  }
}
