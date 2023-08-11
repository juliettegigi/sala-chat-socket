const { Categoria } = require("../models")
const{response}=require("express")
const{existeCategoria}=require("../helpers/db-validators")
//un GET usando populate, con paginado y total
const obtenerCategoria=async(req,res=response)=>{
  
    const{limite,desde}=req.query;// si no vienen en los params no pasa nada, se muestran todos
    
    //const categorias= await Categoria.find({estado:true}).skip(desde).limit(limite);
    //let total=await Categoria.countDocuments({estado:true});
    let [categorias,total]=await Promise.all([
          Categoria.find({estado:true}).skip(desde).limit(limite).populate('usuario','nombre'), //sin populate me muestra el id del user ,ie, "usuario":"jfdlsfjs"
          //con populate le digo: "del campo usuario de categoria, quiero el nombre"==> usuario:{nombre:nombreUsuario}
          Categoria.countDocuments({estado:true})]);
    total=categorias.length;
   res.json({msg:"categoriasGet",total,categorias})  
}

const categoriasGet=async(req,res)=>{

    const{limite,desde}=req.query;// si no vienen en los params no pasa nada, se muestran todos
    const categorias= await Categoria.find({estado:true}).skip(desde).limit(limite);
    let total=await Categoria.countDocuments({estado:true});
    total=categorias.length;
   res.json({msg:"categoriasGet",total,categorias})  
}

const categoriasGetById=async(req,res)=>{
    const {id}=req.params;
    const categoria=await Categoria.findById(id).populate('usuario','nombre');
    existeCategoria(categoria);
     
}
const categoriasPost=async(req,res)=>{
    let{nombre}=req.body;
    nombre=nombre.toUpperCase();
    const categoria=new Categoria({nombre,usuario:req.usuario._id});
    await categoria.save();
    res.json({msg:"categoriaPost",categoria})  
}

const categoriasPut=async(req,res)=>{
    
    const{ nombre,estado}=req.body;
    const obj={};
    if(nombre || estado){
        if(nombre)
          obj.nombre=nombre.toUpperCase();
        if(estado)
           obj.estado=estado
    }
      
    else return res.json({msg:"No body"})  
    obj.usuario=req.usuario;// le asigno el user que hace el update
    const{id}=req.params;
    const categoria=await Categoria.findByIdAndUpdate(id,obj,{new:true});// si pongo new:true=> me retorna el registro actualizado
    existeCategoria(categoria,`Categoría actualizada.`);

}

const categoriasDelete=async(req,res)=>{
    const{id}=req.params;
    const categoria=await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});
    existeCategoria(categoria,`Categoría eliminada.`);
}

module.exports={
    categoriasDelete,categoriasGet,categoriasPost,categoriasPut,categoriasGetById,obtenerCategoria
}