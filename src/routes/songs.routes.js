const express = require('express')

const AppError = require('../errors/AppError')
const { Song, validateSong } = require('../models/songs')
const { Genre } = require('../models/genres')
const validateInput = require('../middlewares/validateInput')
const validateObjectId = require('../middlewares/validateObjectId')
const ensureAuthentication = require('../middlewares/ensureAuthentication')

const router = express.Router()

router.get('/', async (request, response) => {
  const songs = await Song.find()

  return response.json(songs)
})

router.get('/:id', validateObjectId, async (request, response) => {
  const findSong = await Song.findById(request.params.id)
  if(!findSong) throw new AppError('Song not found', 404)

  return response.json(findSong)
})

router.post('/', [ensureAuthentication, validateInput(validateSong)], async (request, response) => {
  const genre = await Genre.findById(request.body.genreId)
  if(!genre) throw new AppError('Genre does not exist', 400)

  const newSong = new Song({
    genre: {
      _id: genre._id,
      name: genre.name 
    },
    name: request.body.name,
    yearRelesead: request.body.yearRelesead,
    artist: request.body.artist
  })

  await newSong.save()

  return response.json(newSong)
})

router.put('/:id', [ensureAuthentication, validateObjectId, validateInput(validateSong)], async (request, response) => {
  const newGenre = await Genre.findById(request.body.genreId)
  if(!newGenre) throw new AppError('Genre does not exist', 400)

  const updatedSong = await Song.findByIdAndUpdate(request.params.id, {
    $set: {
      genre: {
        _id: newGenre._id,
        name: newGenre.name
      },
      name: request.body.name,
      yearRelesead: request.body.yearRelesead,
      artist: request.body.artist
    }
  },
  { new: true })

  if(!updatedSong) throw new AppError('Song not found')

  return response.json(updatedSong)
})

module.exports = router