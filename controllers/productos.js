const{request,response}=require('express')
const {Producto,Categoria} = require('../models');


const productosGet=async(req=request,res=response)=>{
    const{limite,desde}=req.query;
    const condicion={estado:true};

    const [total,productos]=await Promise.all([Producto.countDocuments(condicion),
                                               Producto.find(condicion).limit(limite).skip(desde).populate('usuario','nombre').populate('categoria','nombre')]);
    res.json({total,productos})
}

const productosGetById=async(req=request,res=response)=>{
    const {id}=req.params;
    const producto=await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre');
    res.json({producto})

    }

const productosPost=async(req=request,res=response)=>{
  
    const {nombre,precio,categoria,descripcion}=req.body;   
   
   nombre=nombre.toUpperCase();
   

    //validar q el nombre no se repita, porq es unique
   const c=await Producto.findOne({nombre});
    
    if(c)
          return res.json({msg:"El nombre del producto ya existe  en la DB."})   


    const producto=new Producto({nombre,precio,categoria,descripcion,usuario:req.usuario._id})
    // const categoria=new Categoria({nombre,usuario:req.usuario._id});
    await producto.save();
    res.json({producto})
}

const productosPut=async(req,res=response)=>{
    const {id}=req.params;
    const {usuario,...rest}=req.body;//rest es un objeto y los puntos me dejan las propiedades
   
    if(rest.nombre){
        rest.nombre=rest.nombre.toUpperCase();
    }
       
    rest.usuario=req.usuario._id;// le asigno el usuario que está logueado

        const producto=await Producto.findByIdAndUpdate(id,rest,{new:true});
        return res.json({msg:"Producto actualizado",producto})    
   
}

const productosDelete=async(req,res=response)=>{
    const {id}=req.params;
    
  
        const producto=await Producto.findByIdAndUpdate(id,{estado:false});
        return res.json({msg:"Producto eliminado",producto})    
   
    
}

module.exports={
    productosGet,productosGetById,productosPost,productosPut,productosDelete
}