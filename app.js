const path = require('node:path')
const express = require('express')

const Person = require('./models/person')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.static(path.join(__dirname, 'frontend', 'dist')))
app.use(express.json())
if (process.env.NODE_ENV !== 'test') {
  app.use(middleware.requestLogger)
}

app.get('/health', (request, response) => {
  response.send('ok')
})

app.get('/version', (request, response) => {
  response.send('1') // cambia este texto para comprobar que se publica una versión nueva
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.use('/api/persons', personsRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', require('./controllers/testing'))
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
