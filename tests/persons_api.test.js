const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const config = require('../utils/config')
const Person = require('../models/person')

const api = supertest(app)

const initialPersons = [
  { name: 'Arto Hellas', number: '040-123456' },
  { name: 'Ada Lovelace', number: '39-445323523' },
]

describe('phonebook API', () => {
  beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.MONGODB_URI)
    }
    await Person.deleteMany({})
    await Person.insertMany(initialPersons)
  })

  test('the health check answers ok', async () => {
    const response = await api.get('/health').expect(200)
    assert.strictEqual(response.text, 'ok')
  })

  test('persons are returned as json', async () => {
    const response = await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialPersons.length)
    assert.ok(response.body.every(person => person.id && !person._id))
  })

  test('info shows how many people there are', async () => {
    const response = await api.get('/info').expect(200)
    assert.match(response.text, /Phonebook has info for 2 people/)
  })

  test('a valid person can be added', async () => {
    await api
      .post('/api/persons')
      .send({ name: 'Dan Abramov', number: '12-43234345' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const names = (await Person.find({})).map(person => person.name)
    assert.strictEqual(names.length, initialPersons.length + 1)
    assert.ok(names.includes('Dan Abramov'))
  })

  test('a person without a number is rejected', async () => {
    const response = await api
      .post('/api/persons')
      .send({ name: 'Mary Poppendieck' })
      .expect(400)

    assert.strictEqual(response.body.error, 'name or number missing')
    assert.strictEqual(await Person.countDocuments({}), initialPersons.length)
  })

  test('a number with the wrong format is rejected', async () => {
    const response = await api
      .post('/api/persons')
      .send({ name: 'Mary Poppendieck', number: '1234-5678' })
      .expect(400)

    assert.match(response.body.error, /not a valid phone number/)
  })

  test('a number can be updated', async () => {
    const [person] = await Person.find({ name: 'Arto Hellas' })

    const response = await api
      .put(`/api/persons/${person.id}`)
      .send({ name: 'Arto Hellas', number: '040-999999' })
      .expect(200)

    assert.strictEqual(response.body.number, '040-999999')
  })

  test('a person can be deleted', async () => {
    const [person] = await Person.find({ name: 'Ada Lovelace' })

    await api.delete(`/api/persons/${person.id}`).expect(204)

    assert.strictEqual(await Person.countDocuments({}), initialPersons.length - 1)
  })

  test('a malformatted id gives 400', async () => {
    const response = await api.get('/api/persons/123').expect(400)
    assert.strictEqual(response.body.error, 'malformatted id')
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
