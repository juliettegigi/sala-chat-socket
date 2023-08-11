const{Schema,model}=require('mongoose');

const ProductoSchema=Schema({
    nombre:{type:String,
            required:true,
            unique:true},
    estado:{type:Boolean,
            default:true,
            required:true},
    usuario:{type:Schema.Types.ObjectId,
             ref:'Usuario',
             required:true},
    precio:{type:Number,
            default:0},
    categoria:{type:Schema.Types.ObjectId,
               ref:'Categoria',
               required:true},
    disponible:{type:Boolean,
                default:true},
    descripcion:{type:String,
                 default:"No description"},
   img:{type:String}

})

ProductoSchema.methods.toJSON=function(){
    const{__v,estado,...rest}=this.toObject()
    return rest;
}

module.exports=model('Producto',ProductoSchema);
