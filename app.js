const express = require('express')
const errorHandler = require('errorhandler')

const {
  mongo_username,
  mongo_password,
  mongo_servername,
  mongo_database,
  port
} = require('./config/settings.json')
const mongoose = require('mongoose')

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production'

//Initiate our app
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

if (!isProduction) {
  console.log('I am in dev mode :)')
  app.use(errorHandler())
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
}

mongoose.connect(
  'mongodb+srv://' +
    mongo_username +
    ':' +
    mongo_password +
    '@' +
    mongo_servername +
    '/' +
    mongo_database +
    '?retryWrites=true',
  { useNewUrlParser: true }
)

//Models & routes
require('./models/Cycle')
app.use(require('./routes'))

//Error handlers & middlewares
if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    })
  })
}

app.use((err, req, res, next) => {
  res.status(err.status || 500)

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  })
})

app.listen(port, () =>
  console.log(`  API running on http://localhost:${port}/`)
)
