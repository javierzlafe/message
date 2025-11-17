import express from 'express'              // cargamos express
import { Server } from 'socket.io'         // cargamos socket.io
import http from 'http'                    // cargamos http

const app = express()                      // inicializamos express
app.use(express.static('public'))          // servimos la carpeta public

const server = http.createServer(app)      // servidor http base
const io = new Server(server)              // socket.io encima del http

let usuarios = []                          // lista de usuarios conectados

io.on('connection', socket => {            // cuando se conecta un cliente
  console.log('Nuevo cliente conectado')

  socket.on('registro', usuario => {       // escuchamos el registro del usuario
    socket.usuario = usuario               // guardamos el nombre dentro del socket
    usuarios.push(usuario)                 // lo agregamos a la lista
    console.log('Usuario registrado:', usuario)
  })

  socket.on('mensaje', data => {           // cuando llega un mensaje
    console.log('Mensaje recibido:', data)
    io.emit('mensaje', data)               // lo reenviamos a todos
  })

  socket.on('disconnect', () => {          // cuando alguien se desconecta
    console.log('Usuario desconectado:', socket.usuario)
    usuarios = usuarios.filter(u => u !== socket.usuario) // lo sacamos de la lista
  })
})

server.listen(3000, () => {                // levantamos el servidor
  console.log('Servidor escuchando en http://localhost:3000')
})
