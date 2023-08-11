const{Router}=require('express')
const{buscar}=require('../controllers/buscar')
const router=Router();

//localhost:8083/api/buscar/usuarios/nombre1 nombre2 (puede haber espacio en blanco)
//voy a tener que validar que la coleccion exista
router.get('/:coleccion/:termino',buscar);

module.exports=router;