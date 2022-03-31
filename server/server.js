const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 5000
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())
dotenv.config()

//--------------------Deploy--------------//
const _dirname1 = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname1, '/client/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(_dirname1, '/client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running')
  })
}

//--------------------Deploy-------------//

io.on('connection', socket => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message })
  })
})

server.listen(PORT, () => {
  console.log(`app running on port http://localhost:${PORT}`)
})
