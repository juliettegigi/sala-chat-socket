const {validationResult}=require('express-validator');

const validarCampos=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
       return res.status(400).json(errors);
    next() ;// para q siga con el próximo middleware y si no hay otro middleware va a seguir con el controlador  
}

module.exports={validarCampos};