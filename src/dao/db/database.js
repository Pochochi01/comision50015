/*import mongoose from "mongoose";


const connectMongoose = mongoose.connect("mongodb+srv://largomauroandres:Susana11@cluster0.fsbbh9v.mongodb.net/e-commerce?retryWrites=true&w=majority")
  .then(() => console.log("conectado"))
  .catch((error) => console.log(error))

  export default connectMongoose;*/
import mongoose from "mongoose";
import configObjet from "../../config/config.js";

const {mongo_url} = configObjet;


// comentar para usar singleton y asi crear y usar una sola instancia de la base de datos

/*
mongoose.connect(mongo_url)
    .then(()=>console.log("Conexion Exitosa"))
    .catch( error => console.log("Error: ", error))
*/

class DataBase {
    static #instance;
    constructor(){
        mongoose.connect(mongo_url);
    }

    static getInstance(){
        if (this.#instance) {
            console.log("Conexion previa existente");
            return this.#instance;
        }
        this.#instance = new DataBase();
        console.log("Conexion nueva exitosa")
        return this.#instance;
        
    }
}

export default DataBase.getInstance();