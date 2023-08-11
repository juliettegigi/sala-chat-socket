const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');


const colecciones=['usuarios','categorias','productos','roles'];




const buscarUsuarios = async( termino = '', res = response ) => {

    //termino puede ser un id, el nombre del user o el correo del user
    //IE, me pueden buscar por id, por nombre o por correo

    //si es un id
    const esMongoID = ObjectId.isValid( termino ); // retorna un booleano

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []//si usuario_==> retorna un arreglo con el usuario ,sino un arr vacío
        });
    }


    //si no es un id
    const regex = new RegExp( termino, 'i' );
    // se forma una expresion regular con el termino, 
    //para que me busque todo lo que contenga al "termino"  ej: termino=fer ==> me buscaria "fernanda","fernando","fernandez",etc
    //'i' es insensible a si está en mayus o no 
    //$or y $and son propiedades de mongo....ah
    const usuarios = await Usuario.find({   //el find retorna un arreglo, uno vacío si no encuentra
        $or: [{ nombre: regex }, { correo: regex }],// acá pongo las condiciones q debe cumplir... q el nombre haga match con la expresión regular o que lo haga con el correo
        $and: [{ estado: true }]  // y que el estado sea true
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria','nombre')

    res.json({
        results: productos
    });

}


///////////////////////////////////////////

const buscar=(req,res=response)=>{

//localhost:8083/api/buscar/usuarios/id
   const{coleccion,termino}=req.params;
   
   if(!colecciones.includes(coleccion)){
       return res.status(400).json({msg:`${coleccion} no pertenece a nuestra DB`,
                                    coleccionesDB:colecciones})
   }


   switch (coleccion) {
    case 'usuarios':
        buscarUsuarios(termino, res);// esta función me va a responder, le mando que busque un id
    break;
    case 'categorias':
        buscarCategorias(termino, res);
    break;
    case 'productos':
        buscarProductos(termino, res);
    break;

    default:
        res.status(500).json({
            msg: 'Se le olvido hacer esta búsquda'
        })
}

  // res.json({coleccion,termino})
}

module.exports={buscar};