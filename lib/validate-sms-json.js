const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const schema = require('../models/sms.schema.json')

module.exports = input => {
  const validate = ajv.compile(schema)
  const valid = validate(input)
  return valid ? null : validate
}
