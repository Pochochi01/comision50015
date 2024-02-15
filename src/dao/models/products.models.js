import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    thumbnail:{
        type:[String],
    }
});

productsSchema.plugin(mongoosePaginate);
const ProductsModels = mongoose.model("products",productsSchema);

export default ProductsModels;