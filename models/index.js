/* module.exports=require("./categoria");
module.exports=require("./role");
module.exports=require("./server");
module.exports=require("./usuario");
 */

const Categoria=require("./categoria");
const ChatMensajes=require("./chat-mensajes")
const Role=require("./role");
const Server=require("./server");
const Usuario=require("./usuario");
const Producto=require("./producto");
module.exports={
    Categoria,Role,Server,Usuario,Producto,ChatMensajes
}
 
