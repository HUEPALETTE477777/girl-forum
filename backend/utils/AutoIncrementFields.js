const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

function ApplyAutoIncrementingField(schema, field) {
  schema.plugin(AutoIncrement, {
    inc_field: field,
  });
}

module.exports = ApplyAutoIncrementingField;
