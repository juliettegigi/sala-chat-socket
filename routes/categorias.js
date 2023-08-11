const{Router}=require('express');
const { categoriasPost, categoriasPut, categoriasDelete,categoriasGetById, obtenerCategoria } = require("../controllers/categorias");
const { check } = require('express-validator');
const{validarCampos, validarJWT, tieneRole}=require('../middlewares');
const { nombreUnico } = require('../helpers/db-validators');


const router=Router();
//localhost:8083/api/categorias
//router.get('/',categoriasGet);
router.get('/',obtenerCategoria);
router.get('/:id',[
    check("id","id no válido").isMongoId(),
    validarCampos
],categoriasGetById);
router.post('/',[
    check("x-token","No token").notEmpty(),
    validarJWT,
    check("nombre","No name").notEmpty(),
    check("nombre").custom(nombreUnico),
    validarCampos
],categoriasPost);
router.put('/:id',[
    check("id","Id no válido").isMongoId(),
    check('x-token','no token').notEmpty(),
    validarJWT,
    validarCampos
],categoriasPut);
router.delete('/:id',[
    check('id','No id.').notEmpty(),
    check("x-token","No token").notEmpty(),
    validarJWT,
    tieneRole("ADMIN_ROLE")
],categoriasDelete);



module.exports=router;
