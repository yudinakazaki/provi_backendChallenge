const express = require('express')
const bcrypt = require('bcrypt')

const AppError = require('../errors/AppError')
const { User, validateUser } = require('../models/users')
const ensureAuthentication = require('../middlewares/ensureAuthentication')
const ensureAuthorization = require('../middlewares/ensureAuthorization')

const router = express.Router()

router.get('/', [ensureAuthentication, ensureAuthorization], async (request, response) => {
  const users = await User.find()

  return response.json(users)
})

router.delete('/:id', [ensureAuthentication, ensureAuthorization], async (request, response) => {
  const deletedUser = await User.findByIdAndRemove(request.params.id)

  if(!deletedUser) throw new AppError('User not found')

  return response.send('User deleted successfully')
})

module.exports = router