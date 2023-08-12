//acá manejo los mensajes y quienes están conectados

class Mensaje{
    constructor(uid,nombre,mensaje){
        this.uid=uid;
        this.nombre=nombre,
        this.mensaje=mensaje
    }
}


class ChatMensajes{
    #usuarios;
    #ultimos10msg;
    
    constructor(){
        this.#ultimos10msg=[];  // acá los últimos mensajes
        this.#usuarios={};// acá están los usuarios conectados

    }

    get getUltimos10msg(){
        
        return this.#ultimos10msg;
    }

    get getUsuarios(){
        return this.#usuarios
        //return Object.values(this.#usuarios);
    }

    enviarMensaje(uid,nombre,mensaje){
        this.#ultimos10msg.unshift(new Mensaje(uid,nombre,mensaje))
        this.#ultimos10msg=this.#ultimos10msg.splice(0,10);
    }

    conectarUsuario(usuario){
        this.#usuarios[usuario.id]=usuario
    }

    desconectarUsuario(id){
        delete this.#usuarios[id];
    }

   
}

module.exports=ChatMensajes
