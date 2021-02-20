const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
  required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.generateJwtToken = function() {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWTSIGNKEY)
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
  const userJoiSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean()
  })

  return userJoiSchema.validate(user)
}

module.exports = { User, validateUser }