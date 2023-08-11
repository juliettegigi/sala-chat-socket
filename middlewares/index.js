const validarCampos=require('./validar-campos');
const validarJWT=require('./validar-jwt');
const validarRoles=require('./validar-roles');
const validarArchivosubir=require('./validar-archivo')

module.exports={...validarCampos,...validarJWT,...validarRoles,...validarArchivosubir}