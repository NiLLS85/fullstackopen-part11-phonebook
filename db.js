const mongoose = require('mongoose')

const connect = url => {
  mongoose.set('strictQuery', false)
  console.log('connecting to MongoDB')

  return mongoose
    .connect(url)
    .then(() => console.log('connected to MongoDB'))
    .catch(error => {
      console.log('error connecting to MongoDB:', error.message)
      process.exit(1)
    })
}

module.exports = { connect }
