require('dotenv').config();
const fileUpload=require('express-fileupload');
const express=require('express');
const cors=require('cors');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server{
    constructor(){
        this.app=express();
        this.port= process.env.PORT || 3000;
        this.server=require('http').createServer(this.app);//Así creamos el servidor,  un servidor que maneje tanto solicitudes HTTP como comunicación en tiempo real a través de WebSockets. Esta línea crea un servidor HTTP utilizando el módulo http de Node.js y pasa la instancia de la aplicación Express (this.app) como argumento al método createServer. Esto permite que Express maneje las solicitudes HTTP tradicionales.

        //Sin embargo, aún no hemos habilitado Socket.IO para el servidor. 
        //Esta línea importa Socket.IO y lo vincula al servidor HTTP (this.server). Ahora el servidor puede manejar tanto solicitudes HTTP como conexiones en tiempo real utilizando WebSockets a través de Socket.IO.
        this.io=require('socket.io')(this.server);//this.io tiene la info de todos los clientes conectados

        this.listen();
        this.conectarDB();
        this.middlewares();
        this.usuariosPath='/api/usuarios';
        this.authPath='/api/auth';         
        this.categoriasPath='/api/categorias';
        this.productosPath='/api/productos';
        this.buscarPath='/api/buscar';
        this.uploadsPath='/api/uploads';
        this.routes();
        this.sockets(); 
        
        
    }

    sockets(){
        //this.io.on('connection', socketController)
        this.io.on('connection',(socket)=>socketController(socket,this.io))
    }

    conectarDB(){
         dbConnection().then((msj)=>{console.log(msj);

         }).catch(console.log);
    
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json()); //para poder hacer res.json({})
        this.app.use(express.static('public'));
        this.app.use(fileUpload({  //para poder aceptar archivos desde una peticion REST
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }
    routes(){
      this.app.use(this.usuariosPath,require('../routes/user'));
      this.app.use(this.authPath,require('../routes/auth'));
      this.app.use(this.categoriasPath,require('../routes/categorias'))
      this.app.use(this.productosPath,require('../routes/productos'))
      this.app.use(this.buscarPath,require('../routes/buscar'))
      this.app.use(this.uploadsPath,require('../routes/uploads'))
    }

    listen(){
        this.server.listen(this.port,()=>{console.log("app corriendo");})
    }
}

module.exports=Server;