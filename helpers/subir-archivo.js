const path=require('path');
const {v4:uuidv4}=require('uuid'); // esto es para generar ids únicos...a las imágenes les tengo q poner un nombre único para que un usuario pueda subir una imagen con el nombre "c1.jpg" y luego otro user también pueda subir una imagen con el nomnre "c1.jpg"



const subirArchivo=(files,extensionesValidas=['jpg','png','jpeg','gif'],carpeta='')=>{//por si quieren pasarme la carpeta en la que se quiera guardar el archivo
   
    return new Promise((resolve,reject)=>{
         // acá tengo el archivo
    const {archivo}=files;
    //valido la extensión del archivo
    const nombreCortado=archivo.name.split(".");
    const extension=nombreCortado[nombreCortado.length-1];
    if(!extensionesValidas.includes(extension))
        return reject(`La extensión, ${extension}, no es permitida`)
    
    // construyo el nombre del archivo y el path en donde se va a guardar el archivo.
    const nombreArchivo=uuidv4()+"."+extension;
    //path jjoin une las dire q le paso por params, le pasé el path de controllers.uploads, luego , la carpeta uploads y el nombre del archivo de la imagen ==> el path resulta en 
    const uploadPath =path.join( __dirname , '../uploads/',carpeta,nombreArchivo);//path físico de mi computadora
    // el archivo está en un almacenamiento temporal, lo muevo al path q construí...mv es la función para hacer eso, puede haber un error como q no exista la carpeta
    archivo.mv(uploadPath,(err)=> {
      if (err) {
        reject(err)
      }
  
      resolve(nombreArchivo);// ell path no le sirve a la persona porq no va a poder acceder a la carpeta privada del servidor, no sirve enviar el path, si el nombre del archivo
    });
}
    )
}


module.exports={subirArchivo}