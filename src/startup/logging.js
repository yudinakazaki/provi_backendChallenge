const winston = require('winston')
require('winston-mongodb')


module.exports = () => {
  winston.add(new winston.transports.File({ filename: 'logs.log' }))
  winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost/spotify',
    level: 'info'
  }))

  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  )

  process.on('unhandledRejection', ex => {
    winston.error(ex.message)
    process.exit(1)
  })
}