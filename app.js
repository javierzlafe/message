/* 
Clase 6.1 — Fundamentos de WebSockets

Vamos a empezar entendiendo por qué necesitamos WebSockets y qué problema vienen 
a resolver. Hasta ahora, siempre que trabajamos con HTTP seguimos el modelo 
clásico de solicitud y respuesta. El cliente pide algo, el servidor responde, 
y la conexión se cierra. Ese modelo funciona muy bien para cargar páginas, 
pedir datos a una API o enviar formularios, pero tiene una limitación importante: 
no permite comunicación en tiempo real. Si necesitamos que algo cambie en pantalla 
sin que el usuario refresque o haga una petición, HTTP no nos alcanza.

Acá es donde aparecen los WebSockets. Nos permiten crear una conexión 
bidireccional y persistente entre el cliente y el servidor usando una 
sola conexión TCP. Una vez que esta conexión está abierta, ambos pueden enviarse 
datos en cualquier momento. Esto significa que el servidor, por primera vez, 
puede hablarle al cliente sin que el cliente tenga que pedir nada.

//que es TCP?
Cuando nosotros hablamos de TCP estamos hablando de un protocolo de 
comunicación de bajo nivel que garantiza que los datos viajen completos, 
ordenados y sin errores. Cada vez que un dispositivo quiere comunicarse con otro, 
TCP se encarga de establecer una conexión confiable entre ambos lados. 
Esa conexión se mantiene abierta mientras estén intercambiando datos y 
asegura que todo llegue tal como fue enviado. Si algún fragmento se pierde, 
TCP lo vuelve a enviar; si llegan desordenados, los reordena; 
si algo llega corrupto, lo descarta y lo pide de nuevo. Por eso decimos que 
TCP nos da fiabilidad, orden y control del flujo. Para nosotros, 
como desarrolladores, esto significa que no tenemos que preocuparnos por 
errores de transporte, porque TCP ya los resuelve.

Una vez que la conexión TCP está establecida entre cliente y servidor, podemos 
usarla para enviar y recibir datos de manera continua sin estar creando una 
nueva conexión cada vez. Esto es exactamente lo que hace posible que WebSockets 
funcionen: se montan sobre una única conexión TCP que queda abierta y sobre esa 
conexión viajan mensajes en ambas direcciones. Esa es la base de la comunicación 
en tiempo real.

Para dejarlo más claro, podemos comparar ambos modelos. Con HTTP siempre es 
el cliente el que inicia la comunicación y la conexión se cierra con cada 
interacción. Con WebSockets la conexión se abre una sola vez y se mantiene 
activa hasta que uno de los dos decide cerrarla. En HTTP la comunicación es 
unidireccional, en cambio con WebSockets ambos lados pueden enviar datos en 
cualquier momento. Por eso este protocolo es esencial cuando desarrollamos 
aplicaciones que necesitan actualizaciones en tiempo real, como chats, 
juegos multijugador, paneles de control, monitoreo de datos o sistemas de subastas.

Las características más importantes que vamos a remarcar en esta clase son 
la persistencia de la conexión, que evita abrir y cerrar conexiones todo el tiempo;
el bajo overhead, porque no estamos enviando encabezados en cada mensaje; 
y la comunicación bidireccional, que nos da una experiencia mucho más 
dinámica y fluida.

Ahora vamos a hacer una implementación básica en Express para ver cómo 
funciona en la práctica. Primero necesitamos un servidor Express funcionando 
y agregar la herramienta que nos facilita el uso de WebSockets, 
que en nuestro caso va a ser socket.io. y lo instalamos por npm

vamos a la carpeta que creamos
npm init -y
npm install express
creamos el archivo server.js
instalamos socket npm install socket.io
y como tambien vamos a usar socket desde el cliente (osea el html)
vamos a instalar npm install socket.io-client
ahora le damos node server.js para correr el servidor


import express from 'express'          // Importamos Express para crear el servidor web
import { Server } from 'socket.io'     // Importamos Server de socket.io para manejar WebSockets
import http from 'http'                // Importamos http para crear un servidor compatible con socket.io

const app = express()                  // Creamos la aplicación Express

// Servimos la carpeta public
app.use(express.static('public'))      // Indicamos que todos los archivos dentro de /public se sirven como estáticos

const server = http.createServer(app)  // Creamos el servidor HTTP basado en Express
const io = new Server(server)          // Conectamos Socket.io al servidor HTTP

app.get('/', (req, res) => {           // Endpoint para la ruta principal "/"
  res.send('Servidor WebSocket activo') // Respondemos con un texto simple (solo para probar)
})

io.on('connection', socket => {        // Detectamos cuando un nuevo cliente se conecta por WebSocket
  console.log('Nuevo usuario conectado') // Mostramos un mensaje en consola

  socket.on('mensaje', data => {        // Escuchamos un evento llamado "mensaje" enviado por el cliente
    console.log('Mensaje recibido:', data) // Mostramos el mensaje recibido
    io.emit('mensaje', data)             // Reenviamos el mensaje a *todos* los clientes conectados
  })

  socket.on('disconnect', () => {       // Detectamos cuando el usuario se desconecta
    console.log('Usuario desconectado') // Mostramos mensaje en consola
  })
})

server.listen(3000, () => {            // Ponemos el servidor a escuchar en el puerto 3000
  console.log('Servidor escuchando en http://localhost:3000') // Mensaje de confirmación
})



Una vez que tenemos el servidor, necesitamos un cliente que se conecte a él. 
Esto puede ser una página muy simple que solo permita enviar y recibir mensajes.


asi que creamos un index.html dentro de una carpeta public.


<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cliente WebSocket</title>
</head>
<body>
  <h1>Cliente WebSocket</h1>
  <button id="btn">Enviar mensaje</button>

  <script src="/socket.io/socket.io.js"></script>

  <script>
    const socket = io(); // se conecta automáticamente al servidor

    const boton = document.getElementById('btn');

    boton.addEventListener('click', () => {
      socket.emit('mensaje', 'Hola desde el cliente');
    });

    socket.on('mensaje', data => {
      alert('Mensaje recibido del servidor: ' + data);
    });
  </script>
</body>
</html>



Con esto ya tenemos nuestra primera aplicación en tiempo real. 
El cliente envía un mensaje, el servidor lo recibe y lo muestra en pantalla

 */



//Bueno, basta de teoria y codigo aburrido, vamos a hacer magia negra...

/* 
Paso 1: instalar SweetAlert2 en el html:<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


Paso 2: ahora armemos de nuevo el html


<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"> <!-- Codificación -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive -->
  <title>Chat WebSockets</title> <!-- Título -->
  <script src="/socket.io/socket.io.js"></script> <!-- Cliente de socket.io -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> <!-- SweetAlert2 -->
</head>
<body>
  <h1>Chat</h1> <!-- Título -->

  <input id="mensaje" placeholder="Escribí tu mensaje"> <!-- Input del mensaje -->
  <button id="btnEnviar">Enviar</button> <!-- Botón de envío -->

  <ul id="lista"></ul> <!-- Lista donde mostramos mensajes -->

  <script src="./client.js"></script> <!-- Lógica del cliente -->
</body>
</html>

Paso 3: vamos a crear una carpeta llamada client.js en la carpeta public

const socket = io() // conectamos al servidor

let usuario = localStorage.getItem('usuario') // buscamos si hay un usuario guardado

// si no está, pedimos nombre con SweetAlert2
if (!usuario) {
  Swal.fire({
    title: 'Bienvenido',
    text: 'Ingresá tu nombre para entrar al chat',
    input: 'text',
    allowOutsideClick: false,          // obliga a escribir nombre
    confirmButtonText: 'Entrar'        // texto del botón
  }).then(result => {                  
    usuario = result.value             // guardamos el dato
    localStorage.setItem('usuario', usuario) // lo guardamos local
    socket.emit('registro', usuario)   // lo enviamos al servidor
  })
} else {
  socket.emit('registro', usuario)     // si ya existía, lo enviamos directo
}

// seleccionamos elementos
const input = document.getElementById('mensaje') // input del mensaje
const btn = document.getElementById('btnEnviar') // botón de enviar
const lista = document.getElementById('lista')   // lista de mensajes

btn.addEventListener('click', () => {            // cuando hacemos click
  const texto = input.value                      // leemos el input
  socket.emit('mensaje', { usuario, texto })     // enviamos usuario + texto
  input.value = ''                               // limpiamos input
})

socket.on('mensaje', data => {                   // recibimos un mensaje
  const li = document.createElement('li')        // creamos un li
  li.textContent = `${data.usuario}: ${data.texto}` // texto del li
  lista.appendChild(li)                          // lo agregamos
})



*/