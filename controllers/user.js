const {request,response}=require('express');
const bcryptjs=require('bcryptjs');
const Usuario=require('../models/usuario');
const { emailExiste } = require('../helpers/db-validators');

const userGet=async(req=request,res=response)=>{
    //const total=await Usuario.count();
    //const total=await Usuario.count({estado:true});
    //const total=await Usuario.find({estado:true}).count();// me cuenta los users cuyo estado es true 
    
    // en url voy a recibir tipo "localhost:8083/api/usuarios?limit=2&desde=4"
    const {limite=5,desde=0}=req.query;
    const query={estado:true};
    const[total,usuarios]=await Promise.all([Usuario.countDocuments(query),
                                            Usuario.find(query).limit(limite).skip(desde)]);//desde +1 y cantidad
    res.json({
        msg:"api GET",
        total, //total de users logicamente haablando
        usuarios
    });
}

const userPost=async(req,res)=>{
 
    const {nombre,correo,password,rol,img=""}=req.body;
    const usuario=new Usuario({nombre,correo,password,rol,img});
  
    //encriptar la pass
    const salt=bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password,salt);

   
        await usuario.save();
    
    
    
    res.status(201).json({msg:"POST. Usuario creado correctamente\n",usuario})
}

const userDelete=async(req,res)=>{
    const{id}=req.params;
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false});
    //borrado físico:
    //usuario=Usuario.findByIdAndDelete(id);

    res.json({
        msg:"DELETE . registro eliminado",
        usuario
    })
}


/*

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}
*/


const userPut=async(req,res)=>{
    const {id}=req.params;
    const{password,google,correo,_id,...resto}=req.body;// acá tengo el nuevo objeto, con las propiedades que quieren modificar
    let mensaje=null;
 //ahora necesito buscar al usuario al que le quieren hacer el update, lo busco pòr id, q me lo mandan en la url
 let usuario=await Usuario.find({id});

    if(password){//si en el body está la propiedad pass, google, a esos campos les tengo q hacer algo especial antes de actualizar
      const salt=bcryptjs.genSaltSync();
      resto.password=bcryptjs.hashSync(password,salt);
    }


    if(correo){
        const user=await emailExiste(correo,false);
        if(user && user._id!==usuario._id)
                   mensaje="El correo ingresado ya está registrado en la DB"      
    }
if(!mensaje)
   usuario=await Usuario.findByIdAndUpdate(id,resto);
   
  
     res.json({
        msg:mensaje  || "Put. actualizando data "+id,
        usuario//me muestra el usuario antes del update
     }) 
}

const userPatch=(req,res)=>{
    res.json({
       msg:"Patch API"
    }) 
}


module.exports={
    userGet,userPatch,userDelete,userPut,userPost
}
