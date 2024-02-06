import mongoose from "mongoose";


const connectMongoose = mongoose.connect("mongodb+srv://largomauroandres:Susana11@cluster0.fsbbh9v.mongodb.net/e-commerce?retryWrites=true&w=majority")
  .then(() => console.log("conectado"))
  .catch((error) => console.log(error))

  export default connectMongoose;