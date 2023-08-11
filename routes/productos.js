const {Router}=require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT, esAdminRol } = require("../middlewares");
const {productosGet,productosGetById,productosPost,productosPut,productosDelete}=require("../controllers/productos");
const { existeCategoriaId, existeProducto } = require("../helpers/db-validators");


const router=Router();

//localhost:8083/api/productos
router.get( '/',productosGet);
router.get('/:id',[
    check('id','No es un id de mongo.').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],productosGetById);
router.post('/',[
    check("x-token","No token").notEmpty(),
    validarJWT,
    check("nombre","El nombre es obligatorio.").notEmpty(),
    check("categoria","La categoría es obligatoria").notEmpty(),
    check("nombre","Nombre: string").isString(),
    check('categoria',"No es un id de mongo.").isMongoId(),
    check('categoria').custom(existeCategoriaId),
    check("precio","Precio:numeric").optional().isNumeric(),
    validarCampos
],productosPost);
router.put('/:id',[
    check('id','No es un id de mongo.').isMongoId(),
    check("x-token","No token").notEmpty(),
    validarJWT,
    check('id').custom(existeProducto),
    check("nombre","Nombre: string").optional().isString(),
    check('categoria',"No es un id de mongo.").optional().isMongoId(),
    check('categoria').optional().custom(existeCategoriaId),
    validarCampos
],productosPut);
router.delete('/:id',[
    check('id','No es un id de mongo.').isMongoId(),
    check("x-token","No token").notEmpty(),
    validarJWT,
    esAdminRol,
    check('id').custom(existeProducto),
    validarCampos
],productosDelete);

module.exports=router;