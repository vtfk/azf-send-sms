const { v4: uuid } = require('uuid')

module.exports.Error = (message, error, correlationId = uuid(), status = 500) => {
  return {
    status: status,
    body: {
      message,
      error,
      correlationId
    },
    headers: {
      'Content-Type': 'application/json',
      'Correlation-Id': correlationId
    }
  }
}

module.exports.Accepted = (url, body, correlationId = uuid(), retrySeconds = 10) => {
  return {
    status: 202, // Accepted
    body: {
      message: body,
      correlationId
    },
    headers: {
      'Content-Type': 'application/json',
      'Correlation-Id': correlationId,
      Location: url,
      'Retry-After': retrySeconds
    }
  }
}

module.exports.errorRes = module.exports.Error
module.exports.acceptedRes = module.exports.Accepted
