const express = require('express')
require('express-async-errors')

const admin = require('../routes/admin.routes')
const users = require('../routes/users.routes')
const login = require('../routes/login.routes')
const genres = require('../routes/genres.routes')
const songs = require('../routes/songs.routes')
const error = require('../middlewares/error')


module.exports = (app) => {
  
  app.use(express.json())

  app.use('/api/users', users)
  app.use('/api/admin', admin)
  app.use('/api/login', login)
  app.use('/api/genres', genres)
  app.use('/api/songs', songs)
  app.use(error)
}