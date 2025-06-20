require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API with MongoDB',
    version: '1.0.0',
    description: 'API for user authentication and post creation',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
}

const swaggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get('/', (req, res) => {
  res.redirect('/api/users/login')
})

app.use('/api/users', authRoutes)
app.use('/api/posts', postRoutes)


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`Swagger on http://localhost:${PORT}/api-docs`)
    })
  })
  .catch(err => {
    console.error('Failed to connect to mongoDB')
    console.error(err)
  })
