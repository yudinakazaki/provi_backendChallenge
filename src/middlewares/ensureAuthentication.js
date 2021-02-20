const jwt = require('jsonwebtoken')
const AppError = require('../errors/AppError')

module.exports = (request, response, next) => {
  const token = request.header('x-auth-token')

  if(!token) throw new AppError('You need to be logged to do it!', 401)

  try {
    const decoded = jwt.verify(token, process.env.JWTSIGNKEY)
    request.user = decoded
    next()
  } catch {
    throw new AppError('Invalid token', 400)
  }

}