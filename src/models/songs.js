const mongoose = require('mongoose')
const Joi = require('joi')
const { genreSchema } = require('../models/genres')
Joi.objectId = require('joi-objectid')(Joi)

const songSChema = new mongoose.Schema({
  genre: new mongoose.Schema(genreSchema),
  name: {
    type: String,
    required: true
  },
  yearRelesead: {
    type: Number,
    required: true
  },
  artist: {
    type: String,
    required: true
  }
})

const Song = mongoose.model('Song', songSChema)

const validateSong = (song) => {
  const songJoiSchema = Joi.object({
    genreId: Joi.objectId().required(),
    name: Joi.string().required(),
    yearRelesead: Joi.number().required(),
    artist: Joi.string().required()
  })

  return songJoiSchema.validate(song)
}

module.exports = { Song, validateSong }