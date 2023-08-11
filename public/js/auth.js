const formulario=document.querySelector('form');

var url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://chattsockett.onrender.com/api/auth/';/* TODO cambiar esto */





formulario.addEventListener('submit',ev=>{ //el listener q necesito escuchar es el submit, porq ese es el q tiene el formulario
   ev.preventDefault();//para que no se recargue la pág 
   const formData={};// esto es lo que le enviamos al backend
   for(let el of formulario.elements){
      if(el.name.length>0)
          formData[el.name]=el.value;//se crea la propiedad con el nombre del "name"
   }

   fetch(url+'login',{
      method:'POST',
      body:JSON.stringify(formData),
      headers:{'Content-Type':'application/json'}
   })
   .then(resp=>resp.json())
   .then(data=>{
     
          if(data.token)
             localStorage.setItem('token',data.token)
         window.location="chat.html"
   })
   .catch(console.log)
})


        function handleCredentialResponse(response) {
            console.log(response.credential);
           /*  response.credential es el token que me da google */
            const body={id_token:response.credential} 
            fetch(url+"google",
                    {
                     method:'POST',
                     headers:{"Content-Type":"application/json"},
                     body:JSON.stringify(body)  /* convierte un objeto en una cadena json */
                  }
                )
                .then(res=>res.json())
                .then(res=>{
                            localStorage.setItem('token',res.token)
                            localStorage.setItem('email',res.usuario.correo)
                            window.location="chat.html"
                           })
                .catch(console.warn);

     }

     const button=document.getElementById("google_signout");
     button.onclick=async()=>{
      console.log("a ver ",google.accounts.id);// si estamos auth==> tenemos acceso a 'google.accounts.id'
      google.accounts.id.disableAutoSelect();
      google.accounts.id.revoke(localStorage.getItem('email'), done=>{
         localStorage.clear();
         location.reload();
         
      })
     }