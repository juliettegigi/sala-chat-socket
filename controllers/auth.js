const{response}=require('express');
const bcryptjs=require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login=async(req,res=response)=>{
    const{correo,password}=req.body;
    //verificar si el email existe
    try{
      const usuario=await Usuario.findOne({correo,estado:true});
      if(!usuario)
        return res.status(400).json({
          msg:"usuario no pertenece a la DB."
        })
           // verificar que el estado del user sea "true"
    //if(!usuario.estado)
      //return res.status(400).json({msg:"usuario inactivo"})
    

    //verificar la pass. en usuario.password tengo la pass encriptada
    // y password no está encriptada ==> no puedo comparar con un operador relacional
    const validPassword=bcryptjs.compareSync(password,usuario.password);
    if(!validPassword){
        return res.status(400).json({msg:"Pass incorrecta."})
    }
   
   //generar el JWT 
 
       const token=await generarJWT(usuario.id);
    res.json({
       usuario,
        token
    })

      }catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    } 

 
}

const googleSignIn=async(req,res=response)=>{
      const{id_token}=req.body;
      try { console.log({id_token});
       // const googleUser=await googleVerify(id_token);
        //console.log(googleUser);// me imprime el name,picture,email del user con ese token   
      const {nombre,img,correo}=await googleVerify(id_token);//este es el payload del token que nos da google
     
      let usuario=await Usuario.findOne({correo});//busco en mi DB ese correo
     
      if(!usuario){ //tengo que crearlo
         const data={nombre,correo,password:':p',img,google:true,rol:"USER_ROLE",estado:true}//no importa el password porque tenemos un hash y nadie va a poder authenticarse con ':p'
          usuario=new Usuario(data);
         await usuario.save();
      }
      //si si tengo al user en mi db tengo q ver que tenga el estado en true
      else if(!usuario.estado){
             return res.status(401).json({msg:'Hable con el admininistrador, user bloqueado.'})
         }

//le tengo que dar el JWT al user que se loguea
const token =await generarJWT(usuario.id)
res.json({usuario,token})//si todo bien, respondo enviandole al frontend el usauario y su token
     
     
}
catch(error){
  res.status(400).json({
    ok:false,
    msg:'El token no se pudo verificar'+error
  })
}
}


 const renovarToken=async(req,res=response)=>{
      // el validarJWT guardaba en la request al usuqrio....req.usuario
    const usuario=req.usuario;// const {usuario}=req
    const token=await generarJWT(usuario.id);
    res.json({usuario,token})

} 


module.exports={login,googleSignIn,renovarToken}