const{response,request}=require('express');
const { check } = require('express-validator');

const esAdminRol=(req=request,res=response,next)=>{

     const {rol,nombre}=req.usuario;
     if(rol!="ADMIN_ROLE")
         return res.status(401).json({
            msg:`${nombre} no es un administrador, sólo los administradores pueden eliminar.`
         })
    next();     

}


const tieneRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.usuario.rol))
          return res.status(401).json({msg:`El usuario no tiene el rol ${roles} necesario para acceder a la petición.`})
        next(); 
        }
    
}




module.exports={
    esAdminRol,tieneRole
}