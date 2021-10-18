import express from 'express'
import bodyParser from 'body-parser'
import upload from './upload'

const routes = express.Router()

// configure app to use bodyParser()
// this will let us get the data from a POST
routes.use(bodyParser.urlencoded({ extended: true }))
routes.use(bodyParser.json())

routes.use((req, _res, next) => {
  // do logging
  console.log(`Resource requested: ${req.method} ${req.originalUrl}`)
  next() // make sure we go to the next routes and don't stop here
})

routes.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Hello world!' })
})

// routes.use('/api/user', user)
routes.use('/api/image', upload)

export default routes
