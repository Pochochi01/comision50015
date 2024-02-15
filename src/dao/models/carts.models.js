import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchemma = new mongoose.Schema({
    products: [
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true                
            },
            quantity:{
                type:Number,
                required: true
            }
        }
    ]
});

cartSchemma.plugin(mongoosePaginate);
const CartModel = mongoose.model("carts", cartSchemma);

export default CartModel;
