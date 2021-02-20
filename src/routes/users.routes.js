const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const AppError = require('../errors/AppError')
const { User, validateUser } = require('../models/users')
const ensureAuthentication = require('../middlewares/ensureAuthentication')
const validateInput = require('../middlewares/validateInput')

const router = express.Router()

router.get('/me', ensureAuthentication, async (request, response) => {
  const user = await User.findById(request.user._id)

  return response.json({_id: user._id, name: user.name, email: user.email})
})

router.post('/', validateInput(validateUser), async (request, response) => {
  const findEmail = await User.findOne({ email: request.body.email })
  if(findEmail) throw new AppError('E-mail already registered')

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(request.body.password, salt)

  const newUser = new User({
    name: request.body.name,
    email: request.body.email,
    isAdmin: request.body.isAdmin,
    password
  })

  await newUser.save()

  return response.json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email
  })
})

router.put('/me', ensureAuthentication, async (request, response) => {
  const {error} = validateUpdateUser(request.body)
  if(error) throw new AppError(error.details[0].message)

  const user = await User.findById(request.user._id)

  if(request.body.email){
    const isAlreadyRegistered = await User.findOne({ email: request.body.email })
    if(isAlreadyRegistered) throw new error('E-mail already registered')

    user.email = request.body.email
  }

  if(request.body.name){
    user.name = request.body.name
  }

  await user.save()

  return response.json({_id: user._id, name: user.name, email: user.email})
})

router.put('/me/password', ensureAuthentication, async (request, response) =>{
  const {error} = validateUpdatePassword(request.body)
  if(error) throw new AppError(error.details[0].message)

  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(request.body.password, salt)

  const updatedUser = await User.findByIdAndUpdate(request.user._id, {
    $set: {
      password: newPassword
    }
  })
  
  return response.json({
    _id: updatedUser._id, 
    name: updatedUser.name, 
    email: updatedUser.email
  })
})

router.delete('/me', ensureAuthentication, async (request, response) => {
  await User.findByIdAndRemove(request.user._id)

  return response.send('User deleted successfully!')
})


const validateUpdateUser = (updateData) => {
  const updateUserJoiSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email()
  })

  return updateUserJoiSchema.validate(updateData)
}

const validateUpdatePassword = (newPassword) => {
  const updatePasswordJoiSchema = Joi.object({
    password: Joi.string().required()
  })

  return updatePasswordJoiSchema.validate(newPassword)
}

module.exports = router