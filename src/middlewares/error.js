const AppError = require('../errors/AppError')
const winston = require('winston')

module.exports = (err, request, response, next) => {
  if(err instanceof AppError){
    return response.status(err.statusCode).send({
      status: 'error',
      message: err.message
    })
  }

  winston.error(err.message)

  return response.status(500).send({
    status: 'error',
    message: 'Internal server error'
  })
}