import mongoose from "mongoose";
import { hash, genSaltSync } from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required:false,
    },
   
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre('save',  async function (next) {
    const salt = await genSaltSync();
    this.password = await hash(this.password, salt);
    next();
});

const User= mongoose.model('Users', userSchema);

export default User;