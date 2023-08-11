const {Usuario,Categoria,Role,Producto}=require('../models')

const esRoleValido=async(rol='')=>{
    const existeRol=await Role.findOne({rol});
    if(!existeRol)
       throw new Error(`El rol ${rol} no está registrado en la DB`);
}


const emailExiste= async(correo="" , f=true)=>{
    const existeEmail=await Usuario.findOne({correo});
    if(existeEmail && f)
        throw new Error(`El correo ${correo} ya existep en la DB`);
    
    
    if(existeEmail && !f){
        console.log(existeEmail);
        return existeEmail
    }
      
}


const existeUsuarioById=async(id)=>{
   const existeId= await Usuario.findOne({_id:id,estado:true});
   if(!existeId)
      throw new Error(`No existe usuario con id= ${id}`);
    return true;
}

const espacioBlanco=(str="")=>{
    str=str.trim();
    const regext=/^[a-zñá-úä-ü]+(\s[a-zñá-úä-ü]+)*$/;
    
    if(str==="" || (!regext.test(str)))
      throw new Error("cadena vacía")
    else return true;
}

const nombreUnico=async(nombre="")=>{
    nombre=nombre.toUpperCase();
  const categoria= await Categoria.findOne({nombre});
  if(categoria)
    throw new Error(`name,${nombre}, no unique`)
}


const existeCategoria=(categoria,msg)=>{
    if(categoria){
        if (msj)
            res.json({msg,categoria})
        else res.json({categoria})
        }
      
    else res.json({msg:`No id categoria`})   
}
////////////////////////////////
const existeCategoriaId=async(id)=>{
    const categoria=await Categoria.findById(id);
    if(!categoria) 
      throw new Error(`No categoria con id=${id}`);
      
}



const existeProducto=async(id)=>{
    let producto=await Producto.findById(id);
    if(!(producto && producto.estado)){
        throw new Error("No existe producto con id="+id)    
    }
    return true;
}


//const coleccionesPermitidas(coleccion,['usuarios','productos'])
const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
   if(!colecciones.includes(coleccion))
     throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`)
   return true;
}


module.exports={
    esRoleValido,emailExiste,existeUsuarioById,espacioBlanco,nombreUnico,existeCategoria,existeProducto,existeCategoriaId,coleccionesPermitidas
}


