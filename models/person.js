const mongoose = require('mongoose')

// Dos o tres cifras, un guion y más cifras: 09-1234556 o 040-22334455.
const phonePattern = /^\d{2,3}-\d+$/

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be at least 3 characters long'],
    required: [true, 'name is required'],
  },
  number: {
    type: String,
    minLength: [8, 'number must be at least 8 characters long'],
    required: [true, 'number is required'],
    validate: {
      validator: value => phonePattern.test(value),
      message: props => `${props.value} is not a valid phone number (use the form 09-1234556)`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
