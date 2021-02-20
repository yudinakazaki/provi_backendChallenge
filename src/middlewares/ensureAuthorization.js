const AppError = require('../errors/AppError')

module.exports = (request, response, next) => {
  const { isAdmin } = request.user

  if(isAdmin === false) throw new AppError('You are not allowed to do it', 403)
  
  next()
}