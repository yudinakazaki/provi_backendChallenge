const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

const Genre = mongoose.model('Genre', genreSchema)

const validateGenre = (genre) => {
  const genreJoiSchema = Joi.object({
    name: Joi.string().required()
  })

  return genreJoiSchema.validate(genre)
}

module.exports = { Genre, validateGenre, genreSchema }