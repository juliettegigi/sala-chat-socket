const txtUid= document.getElementById("txtUid")
const txtMensaje= document.getElementById("txtMensaje")
const ulUsuarios= document.getElementById("ulUsuarios")
const ulMensaje= document.getElementById("ulMensaje")
const btnSalir=document.getElementById("btnSalir");

var url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://chattsockett.onrender.com/api/auth';/* TODO cambiar esto */

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

socket.on('nuevo-mensaje',dibujarMensajes)

socket.on('usuarios-activos',dibujarUsuarios)

socket.on('mensaje-privado',(payload)=>{ //recibo{ de y mensaje}

    const div=document.createElement("div");
    div.id="chat";
    div.innerHTML=`<div id="nombre">
                     <h3>${payload.de}</h3>
                   </div>
                   <ul id="pv">
                   </ul>
                   <input type="text" id="txtMensajepv" class="form-control mb-2 mb-auto" placeholder="Mensaje" autocomplete="off">
                   
                   `  /* ul para los mensajes pv */
   
        const pv=document.getElementById("pv")
        pv.innerHTML=`<li>${payload.mensaje}</li>`
        const body = document.body;
        if(body.lastChild.id==="chat")
              body.removeChild(body.lastChild);
        body.appendChild(div) ;
          
})


}



txtMensaje.addEventListener('keyup',(event)=>{
    const uid=txtUid;
    if(event.key==="Enter" && txtMensaje.value.trim().length!==0){
       
       socket.emit('enviar-mensaje',{mensaje:txtMensaje.value})
       txtMensaje.value=""
    }
 })





const main =async()=>{

    await validarJWT();
    

}

const dibujarUsuarios= (payload)=>{// {id:{usuario}, id2:{usuario2}}
    ulUsuarios.innerHTML="";
    let html="";
    for(let id in payload){
        const li=document.createElement("li");
        li.innerHTML+=`${payload[id].nombre}<svg  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>`
        li.id = id;
        li.addEventListener('click',(event)=>{   /* cuando hago click en un usuario */
            
          
            const div=document.createElement("div");
            div.id="chat";
            div.innerHTML=`<div id="nombre">
                             <h3>${event.target.textContent}</h3>
                           </div>
                           <ul id="pv">
                           </ul>
                           <input type="text" id="txtMensajepv" class="form-control mb-2 mb-auto" placeholder="Mensaje" autocomplete="off">
                           
                           `  /* ul para los mensajes pv */
            const body = document.body;
            if(body.lastChild.id==="chat")
                  body.removeChild(body.lastChild);
            body.appendChild(div) ; 
            const txtMensajepv= document.getElementById("txtMensajepv");
           txtMensajepv.addEventListener('keyup',(event)=>{
              
                if(event.key==="Enter" && txtMensajepv.value.trim().length!==0){
                    console.log("en msg privado",id);
                   socket.emit('enviar-mensaje',{mensaje:txtMensaje.value,uid:id})
                   txtMensajepv.value=""
                }
             })
            

        })
        ulUsuarios.appendChild(li)    
    }
    
}


const dibujarMensajes= (mensajes=[])=>{// {id:{usuario}, id2:{usuario2}}
    ulMensaje.innerHTML="";
    let ms=""
    mensajes.forEach((elem)=>{
        ms+=`<li>${elem.nombre}: ${elem.mensaje}</li>`
    });
    ulMensaje.innerHTML=ms;
}

main();









