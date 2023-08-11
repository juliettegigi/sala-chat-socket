const path=require('path');
const fs=require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); //con esto autentico a mi backend con cloudinary
const {Usuario,Producto}=require('../models')
const {subirArchivo}=require('../helpers')

const cargarArchivo=async(req,res)=>{
    //si no viene el archivo en la peticion con la key=archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg:'No hay archivo en la petición.'});
      return;
    }

    try{
      const nombreArchivo=await subirArchivo(req.files);//voy a recibir el nombre  del archivo
      res.json({nombreArchivo});
    }catch(error){
      res.json({error});
    }
    
   
  }


const actualizarImagen=async(req,res)=>{

  
  const {id,coleccion}=req.params; 
  let modelo;// va a ser un user o un producto
  switch(coleccion){
    case 'usuarios':
      modelo=await Usuario.findById(id);
      if(!modelo)
         return res.status(400).json({ msg:`No existe un usuario con el id ${id}`})
            
      break;
    case 'productos':
      modelo=await Producto.findById(id);
      if(!modelo)
         return res.status(400).json({ msg:`No existe un producto con el id ${id}`})
      break;
    default :  return res.status(500).json({msg:"No validado"})
  }
try{


  if(modelo.img){ // si tiene imagen previa==> tengo q eliminarla de la carpeta==> voy a necesitar el path del archivo a eliminar
    const pathImagen=path.join(__dirname,'../uploads/',coleccion,modelo.img)
    if(fs.existsSync(pathImagen))//si existe la imagen
      fs.unlinkSync(pathImagen);//la borro
  }
    
    
const nombreArchivo=await subirArchivo(req.files,undefined,coleccion);// le paso el archivo, q viene en req.file, undefined porq no le voy a pasar las extensiones y quiero q cree una carpeta con el nombre de la cooleccion
modelo.img=nombreArchivo;
await modelo.save();// así ya queda guardado el usuario o producto que busqué por idju

  res.json(modelo);
}
catch(error){
  res.json({error})
}

}




const actualizarImagenCloudinary=async(req,res)=>{

  
  const {id,coleccion}=req.params; 
  let modelo;// va a ser un user o un producto
  switch(coleccion){
    case 'usuarios':
      modelo=await Usuario.findById(id);
      if(!modelo)
         return res.status(400).json({ msg:`No existe un usuario con el id ${id}`})
            
      break;
    case 'productos':
      modelo=await Producto.findById(id);
      if(!modelo)
         return res.status(400).json({ msg:`No existe un producto con el id ${id}`})
      break;
    default :  return res.status(500).json({msg:"Colección no considerada."})
  }
try{


  if(modelo.img){ 
    //img en la DB tiene un string de la forma: "http/../../nombre.jpg"
    const nombreArr=modelo.img.split('/');
    //sólo necesito el nombre de la img
    const nombre=nombreArr[nombreArr.length-1];
    const [public_id]=nombre.split('.');// así sólo me quedo con el primer elemento del split
    //ellimino la img pasando como argumento al nombre del archivo
    await cloudinary.uploader.destroy(public_id);
  }
  
  //así subo a cloudinary
  const { tempFilePath}=req.files.archivo;// el path temporal de cuando me envian la petición
  const {secure_url}= await cloudinary.uploader.upload(tempFilePath); // me retorna un objeto con propiedades como: format,height,resource_type:"image",created_at,bytes, y esta, secure_url
  modelo.img=secure_url;  // la actualiza en la DB
  await modelo.save();// así ya queda guardado el usuario o producto que busqué por idju

  res.json(modelo);
}
catch(error){
  res.json({error})
}

}





const mostrarImagen=async(req,res)=>{

  const {id,coleccion}=req.params; 
  let modelo;// va a ser un user o un producto
  switch(coleccion){
    case 'usuarios':
      modelo=await Usuario.findById(id);
      if(!modelo)
         return res.status(400).json({ msg:`No existe un usuario con el id ${id}`})
            
      break;
    case 'productos':
      modelo=await Producto.findById(id);
      if(!modelo)
         return res.status(400).json({ msg:`No existe un producto con el id ${id}`})
      break;
    default :  return res.status(500).json({msg:"No validado"})
  }

  
  if(modelo.img){ // si tiene imagen previa==> tengo q retornarla==> voy a necesitar el path del archivo a retornar
    const pathImagen=path.join(__dirname,'../uploads/',coleccion,modelo.img)
    if(fs.existsSync(pathImagen))//si existe la imagen
      return res.sendFile(pathImagen)
  }
  const pathImagen=path.join(__dirname,'../assets/no-image.jpg')
  return res.sendFile(pathImagen)
}




module.exports={cargarArchivo,actualizarImagen,mostrarImagen,actualizarImagenCloudinary}