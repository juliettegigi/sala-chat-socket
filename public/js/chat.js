const txtUid= document.getElementById("txtUid")
const txtMensaje= document.getElementById("txtMensaje")
const ulUsuarios= document.getElementById("ulUsuarios")
const ulMensaje= document.getElementById("ulMensaje")
const btnSalir=document.getElementById("btnSalir");

var url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://restserver-curso-fher.herokuapp.com/api/auth/google';/* TODO cambiar esto */

let usuario=null;
let socket=null;

// cuando un user se loguea, queda guardado su token en el localStorage
// quiero q cuando entre a chat.html  para entrar, tiene q tener el token, sino lo redirecciono al index
const validarJWT=async()=>{
    const token = localStorage.getItem('token');
   
    if(!token || token.length<=10){  //si el token tiene menos de 10 letras
        window.location='index.html';//redirecciono
        
    }


    //tengo que llamar al endpoint me hace un nuevo token
    try {
        const respuesta=await fetch(url,{
            headers:{"x-token":token}
        })
    
        const {usuario:userDB,token:tokenDB}=await respuesta.json(); // acá ya sabemos cual es el user conectado
        // guardo el nuevo token en el storage
        localStorage.setItem('token',tokenDB);
        usuario=userDB;
        document.title=usuario.nombre;  
    } catch (error) {
        window.location='index.html';//redirecciono
    }  
    
           
    
   
    await conectarSocket();
}


const conectarSocket=async()=>{
 //antes de hacer esta conexión, tengo que validar el JWT
socket=io({  // con esta línea se establece la comunicación server/cliente, viene de la librería, y le puedo enviar info por parámetros, le voy a enviar el JWT en la conexion.En la documentación podemos ver q info podemos enviar como timeouts, veloxidad de rta,etc
    'extraHeaders':{'x-token':localStorage.getItem('token')}//ahí podemos enviar lo q querramos como headers adicionales
}); // cuando hacemos esto, esto va a llegar al socket controller, cuando se conecta

//me conecté.... y ahora disparo un evento  y defino listenners
socket.on('connect',()=>{
    console.log('Socket online');
})

socket.on('disconnect',()=>{
    console.log('Socket offline');
    localStorage.clear();
})

socket.on('recibir-mensaje',()=>{ // escucho cuando alguien emita "recibir mensaje" 

})

socket.on('usuarios-activos',dibujarUsuarios)

socket.on('mensaje-privado',()=>{

})
}

const main =async()=>{

    await validarJWT();
    

}

const dibujarUsuarios= (payload)=>{// {id:{usuario}, id2:{usuario2}}
    
    for(let id in payload){
        const li=document.createElement("li");
        li.innerHTML=payload[id].nombre;
        ulUsuarios.appendChild(li)
    }

}


main();





