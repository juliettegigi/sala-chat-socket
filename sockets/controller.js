const {Socket}=require("socket.io")
const { comprobarJwT } = require("../helpers/generar-jwt");
const {ChatMensajes}=require('../models')
//esas cosas se ehecutan solo una vez, cuando el server se levanta 
const chatMensajes=new ChatMensajes();

const socketController=async(socket=new Socket(),io)=>{   // TODO: sacar el new socket()  
    //Acá va código q se ejecuta cuando un cliente se conecta, también emisiones
   //el cliente se conecta, pero lo puedo desconectar si no tiene el JWT
  //  console.log(socket);// Acá voy a poder recibir la info que me pasa el cliente, si es q me pasa algo y otra info como el id del docket, si esta conectado, el handshake q es como q dos personas se dan la mano...y ahí tenemos los headers y vemos info como : host=quien se está conectando, connection=keep alive es q mantenga la conexion activa, pragma: "no-cache"  q no maneje la caché, "user-agent" nos da el navegador del cual se conecta, cookie,fecha,etc.... y lo que nos sirve de ahí es el "x-token" q es lo q nos envió el cliente en el momento de la conexión server/client
    //como accedo al x-token=?
    console.log(socket.handshake.headers["x-token"]); // lo tengo y hay q validarlo... necesito obtener el user al cual le corresponde este token, eso está en el payload==> me hago una función en helpers para esto, en el mismo archivo de "generar-jwt.js"
    const token=socket.handshake.headers["x-token"];
    const usuario=await comprobarJwT(token);
    if(!usuario)
       return socket.disconnect(); //lo desconecto 
    
    // la persona q se conecta, la tengo q agregar a los usuarios conectados q tengo en chatMensaje   
    chatMensajes.conectarUsuario(usuario);
    io.emit("usuarios-activos",chatMensajes.getUsuarios); // les paso a todos... todos los user q están conectados
    socket.emit('nuevo-mensaje',chatMensajes.getUltimos10msg);
    socket.join(usuario.id);// se conecta a una sala especial, podría enviar un arreglo de salas

    //listenners
    socket.on('disconnect',()=>{
        console.log("Cliente desconectado ",socket.id);
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos',chatMensajes.getUsuarios);

    })

    socket.on('dameELChat',(id)=>{

    })


    socket.on('enviar-mensaje',({mensaje,uid})=>{
        
        if(uid){//mensaje privado, solo se emite para esa sala de chat
            socket.to(uid).emit('mensaje-privado',{de:usuario.nombre,mensaje})
        }
        else{
        chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje);
        
        io.emit('nuevo-mensaje', chatMensajes.getUltimos10msg)}
    })

  
}

module.exports={
    socketController
}