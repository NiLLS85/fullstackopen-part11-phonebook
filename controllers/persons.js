const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
  const { name, number } = request.body ?? {}

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person
    .save()
    .then(savedPerson => response.status(201).json(savedPerson))
    .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body ?? {}

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).json({ error: 'person not found' })
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => response.json(updatedPerson))
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

module.exports = personsRouter
