const testingRouter = require('express').Router()
const Person = require('../models/person')

// Solo existe en modo de pruebas: vacía la base de datos antes de cada prueba E2E.
testingRouter.post('/reset', async (request, response) => {
  await Person.deleteMany({})
  response.status(204).end()
})

module.exports = testingRouter
