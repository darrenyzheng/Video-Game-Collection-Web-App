import mongoose from "mongoose";
import dotenv from 'dotenv';
// Resolve the path to the .env file
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the path to the .env file

const envPath = resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

console.log(process.env.MONGODB_CONNECT_STRING)
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
);

const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});


const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    emailAddress: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    privacy: {type: String, default: 'public'},
    favoriteGenre: {type: String},
    bio: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    birthday: {type: Date},
    collectionPrivacy: {type: Boolean},
    collectionDetails: {type: String}
},  {timestamps: true});



const createUser = async (username, emailAddress, password) => {
    const user = new User({username: username, emailAddress: emailAddress, password: password})
    await user.save();
    return user;
}


userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({username});
    if (!user) {
        return false;
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        return false;
    }

    return user;

};
const User = mongoose.model("User", userSchema);

export {createUser, User}