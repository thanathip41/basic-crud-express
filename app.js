import express from 'express'
import path from 'path'
import logger from 'morgan'
import http from 'http'
import https from 'https'
import env from './app/Config/env.js'
import Router from './routes/router.js'

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const __dirname = path.resolve()
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true) 
  next()
})
app.use('/api', Router)


app.use((req, res, next) => {
  res.status(404).json({
    result : 'Fail',
    message: 'Page Not Found'
  })
})

const port = env.PORT || '3000'
app.set('port', port)

const server = env.NODE_ENV === 'development' ? 
            http.createServer(app) : https.createServer(app)
server.listen(port)

