
const{Router}=require('express');
const {userGet,userPatch,userDelete,userPut,userPost}=require('../controllers/user');
const { check } = require('express-validator');
const{validarCampos,esAdminRol,validarJWT} = require('../middlewares');
const { esRoleValido, emailExiste, existeUsuarioById ,espacioBlanco} = require('../helpers/db-validators');


const router=Router();

router.get('/',userGet);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre',"queee").custom(espacioBlanco),
    check('password','Mínimo 6 caracteres').isLength({min:6}),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos
],userPost);

router.delete('/:id',[
    check("x-token","No token").notEmpty(),
    validarJWT,
    esAdminRol,
    //tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','no es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
],
userDelete)

router.put('/:id',[
    check('id','no es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
],userPut)

router.patch('/',userPatch)

module.exports=router;