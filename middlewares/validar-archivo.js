const validarArchivosubir=(req,res,next)=>{

    //si no viene el archivo en la peticion con la key=archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) 
         return res.status(400).json({msg:'No hay archivo en la petición.'});
     
   next();
 }
 
 
 module.exports={validarArchivosubir}