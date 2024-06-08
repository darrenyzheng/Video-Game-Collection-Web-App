import mongoose from "mongoose";
import dotenv from 'dotenv';
// Resolve the path to the .env file
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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
    privacy: {type: Boolean},
    favoriteGenre: {type: String},
    bio: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    birthday: {type: Date},
    collectionPrivacy: {type: Boolean},
    collectionDetails: {type: String}
},  {timestamps: true});

const User = mongoose.model("User", userSchema);

const createUser = async (username, emailAddress, password) => {
    const user = new User({username: username, emailAddress: emailAddress, password: password})
    return user.save();
}

export {createUser, User}