const { Router } = require("express");
const { login, googleSignIn,renovarToken } = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { emailExiste } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares");

const router=Router();

router.post('/login',[
    check('correo','El correo es obligatorio').notEmpty(),
    check('correo','Email no  válido').isEmail(),
    check('correo').not().custom(emailExiste),
    check('password','La contraseña es obligatoria').notEmpty(),
    validarCampos
],login);

router.post('/google',[
           check("id_token","id-token es necesario").not().isEmpty(),
            validarCampos
        ],googleSignIn);


router.get('/',[  //voy a leer el JWT y si es correcto, voy a generar uno nuevo
    check("x-token","No token").notEmpty(),
    validarJWT
],renovarToken)   


module.exports=router;