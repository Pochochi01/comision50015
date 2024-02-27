import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },

    last_name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        require: true
    },

    age: {
        type: Number,
        require: true
    }

});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;