const express = require('express')

const { Genre, validateGenre } = require('../models/genres')
const AppError = require('../errors/AppError')
const ensureAuthentication = require('../middlewares/ensureAuthentication')
const ensureAuthorization = require('../middlewares/ensureAuthorization')
const validateInput = require('../middlewares/validateInput')
const validateObjectId = require('../middlewares/validateObjectId')

const router = express.Router()

router.get('/', async (request, response) => {
  const genres = await Genre.find()

  return response.send(genres)
})

router.get('/:id', validateObjectId, async (request, response) => {
  const findGenre = await Genre.findById(request.params.id)
  if(!findGenre) return response.json({error: 'no Genre found'})
  return response.json({ name: findGenre.name })
})

router.post('/', [ensureAuthentication, validateInput(validateGenre)], async (request, response) => {
  const newGenre = new Genre({
    name: request.body.name
  })

  await newGenre.save()

  return response.json({_id: newGenre._id, name: newGenre.name })
})

router.put('/:id', [ensureAuthentication, validateObjectId, validateInput(validateGenre)], async (request, response) => {
  const updatedGenre = await Genre.findByIdAndUpdate(request.params.id, {
    $set: {
      name: request.body.name
    }
  },
  { new: true })

  if(!updatedGenre) throw new AppError('Genre not found!', 404)

  return response.json({name: updatedGenre.name})
})

router.delete('/:id', [ensureAuthentication, ensureAuthorization, validateObjectId], async (request, response) => {
  const deletedGenre = await Genre.findByIdAndRemove(request.params.id)
  if(!deletedGenre) throw new AppError('Genre not found', 404)

  return response.json({ message: 'Genre successfully deleted' })
})

module.exports = router