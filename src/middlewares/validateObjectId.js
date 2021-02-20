const mongoose = require('mongoose')
const AppError = require('../errors/AppError')

module.exports = (request, response, next) => {
  if(!mongoose.Types.ObjectId.isValid(request.params.id))
    throw new AppError('Not found')

  next()
}