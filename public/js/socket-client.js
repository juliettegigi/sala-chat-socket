
const socket=io();// con esta línea se conecta el cliente, viene de la librería

socket.on('connect',()=>{
    console.log("Conectado.");//se muestra en la consola del navegador. Socket mantiene el estado de comunicación con nuestro server
   
})

socket.on('disconnect',()=>{  //socket on es para escuchar un evento
    console.log("Desconectado");
})

