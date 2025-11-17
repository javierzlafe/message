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
