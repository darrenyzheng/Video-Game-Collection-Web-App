import mongoose from "mongoose";
import dotenv from 'dotenv';
// Resolve the path to the .env file
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the path to the .env file

const envPath = resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
);

const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    birthday: { type: Date },
    gameCollection: [{
        id: { type: Number },
        rating: { type: Number },
        summary: { type: String },
        name: { type: String },
        genres: [{
            name: { type: String, required: true }
        }],
        platform: { type: [] },
        screenshots: { type: [] },
        cover: { type: String },
        condition: { type: [] }
    }]
}, { timestamps: true });



const createUser = async (username, emailAddress, password) => {
    const user = new User({ username: username, emailAddress: emailAddress, password: password })
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

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        return false;
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        return false;
    }

    return user;

};

const saveGame = async (user, id, rating, summary, name, genres, platform, screenshots, cover, condition) => {
    if (!user.gameCollection.some(game => game.id === id)) {
        user.gameCollection.push({ id: id, rating: rating, summary: summary, name: name, genres: genres, platform: [platform], screenshots: screenshots, cover: cover, condition: [condition] });
        await user.save();
        return true;
    }

    const index = user.gameCollection.findIndex(game => game.id === id);
    if (user.gameCollection[index].platform.includes(platform)) {
        return false;
    }

    if (!user.gameCollection[index].condition.includes(condition)) {
        user.gameCollection[index].condition.push(condition);
    }
    user.gameCollection[index].platform.push(platform);

    await user.save();
    return true;
}

const User = mongoose.model("User", userSchema);

export { createUser, saveGame, User }