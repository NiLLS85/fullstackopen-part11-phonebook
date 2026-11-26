const app = require('./app')
const config = require('./utils/config')
const db = require('./db')

db.connect(config.MONGODB_URI).then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
})
