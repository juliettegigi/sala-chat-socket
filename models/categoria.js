const{Schema,model}=require('mongoose')
const CategoriaSchema=Schema({
    nombre:{type:String,
            required:true,
            unique:true},
    estado:{type:Boolean,
            default:true,
            required:true},
    usuario:{type:Schema.Types.ObjectId,
             ref:'Usuario',
            required:true}


                 
});


CategoriaSchema.methods.toJSON=function(){
        const{__v,estado,...rest}=this.toObject()
     return rest;
}

module.exports=model('Categoria',CategoriaSchema)