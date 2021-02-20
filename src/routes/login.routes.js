const express = require('express')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const AppError = require('../errors/AppError')
const { User } = require('../models/users')

const router = express.Router()

router.post('/', async (request, response) => {
  const { error } = validateLogin(request.body)
  if(error) throw new AppError(error.details[0].message)

  const user = await User.findOne({ email: request.body.email })
  if(!user) throw new AppError('Invalid user or e-mail')

  const validPassword = await bcrypt.compare(request.body.password, user.password)
  if(!validPassword) throw new AppError('Invalid user or e-mail')

  const token = user.generateJwtToken()

  return response.header('x-auth-token', token).send('Authentication completed successfully!')
})

const validateLogin = (login) => {
  const loginJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  return loginJoiSchema.validate(login)
}

module.exports = router