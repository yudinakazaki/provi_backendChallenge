const AppError = require('../errors/AppError')

module.exports = (validator) => {
  return (request, response, next) =>{
    const { error } = validator(request.body)
    if (error) throw new AppError(error.details[0].message)
    next()
  }
}