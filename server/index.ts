import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

const app = express()
const port = 4000
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    // credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`)

  socket.on('join', (room) => {
    socket.join(room)
    console.log(`${socket.id} joined room ${room}`)
  })

  socket.on('sendMessage', (msg) => {
    io.to(msg.room).emit('message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => 'server is running on port 4000')
