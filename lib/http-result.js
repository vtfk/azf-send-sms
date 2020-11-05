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

module.exports.Ok = (body, correlationId = uuid(), status = 200) => {
  return {
    status, // Default: 200
    body,
    headers: {
      'Content-Type': 'application/json',
      'Correlation-Id': correlationId
    }
  }
}

module.exports.okRes = module.exports.Ok
module.exports.acceptedRes = module.exports.Accepted
module.exports.errorRes = module.exports.Error
