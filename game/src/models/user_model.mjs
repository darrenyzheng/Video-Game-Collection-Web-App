import mongoose from "mongoose";
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const envPath = resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
);

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});


const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteGenre: {
        type: String, default: '', trim: true,
    },
    favoriteGame: {
        type: String, default: '', trim: true,
    },
    firstName: {
        type: String, default: '', trim: true,
    },
    lastName: {
        type: String, default: '', trim: true,
    },
    birthday: { type: Date },
    gameCollection: [{
        id: { type: Number },
        rating: { type: Number },
        summary: { type: String },
        name: { type: String },
        genres: [{
            name: { type: String, required: true }
        }],
        platforms: { type: [] },
        platformOwned: {
            type: Map,
            of: [String]
        },
        screenshots: { type: [] },
        cover: { type: Object },
    }]
}, { timestamps: true });



const createUser = async (username, emailAddress, password) => {
    const user = new User({ username: username, emailAddress: emailAddress, password: password })
    await user.save();
    return user;
}

const verifyUser = async (username) => {
    try {
        const user = await User.findOne({ username });
        if (user) {
            return true;
        }
        return false;
    }
    catch (err) {
        throw err;

    }
}

const deleteUser = async (username) => {
    try {
        const result = await User.findOneAndDelete({ username });
        if (!result) {
            console.log(`${username} not found`);
            return false;
        }
        console.log(`${username} deleted successfully.`)
        return true;
    }
    catch (err) {
        console.log(`Error: ${err}`)
        throw err;
    }
}

const editUser = async (user, userDetails, newPassword) => {
    try {
        const count = await User.countDocuments({ emailAddress: userDetails.emailAddress });
        if (count > 0 && user.emailAddress != userDetails.emailAddress) {
            return false;
        }

        Object.keys(userDetails).forEach(key => {
            user[key] = userDetails[key];
        });

        await user.updatePassword(newPassword);
        await user.save();
        return user;
    }

    catch (err) {
        throw err;
    }
}

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
            return next();
        }
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.updatePassword = async function (newPassword) {
    this.password = newPassword;
    await this.save();
};

userSchema.statics.login = async function (username, password) {
    try {
        const user = await this.findOne({ username });
        if (!user) {
            return false;
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return false;
        }
        return user;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

const saveGame = async (user, id, rating, summary, name, genres, platforms, platform, screenshots, cover, condition) => {
    try {
        if (!user.gameCollection.some(game => game.id === id)) {
            user.gameCollection.push({ id: id, rating: rating, summary: summary, name: name, genres: genres, platforms, platformOwned: new Map([[platform, [condition]]]), screenshots: screenshots, cover: cover });
            await user.save();
            return true;
        }

        const index = user.gameCollection.findIndex(game => game.id === id);
        const gameOfInterest = user.gameCollection[index];

        if (!gameOfInterest.platformOwned.has(platform)) {
            gameOfInterest.platformOwned.set(platform, [condition]);
        }

        else {
            if (gameOfInterest.platformOwned.get(platform).includes(condition)) {
                return false;
            }
            const conditions = gameOfInterest.platformOwned.get(platform);
            conditions.push(condition);
            gameOfInterest.platformOwned.set(platform, conditions);
        }


        await user.save();
        return true;
    }

    catch (err) {
        throw err;
    }
}

const deleteGame = async (user, id) => {
    try {
        const index = user.gameCollection.findIndex(game => game.id === id);
        if (index < 0) {
            return false;
        }
        user.gameCollection.splice(index, 1);
        await user.save();
        return true;
    }
    catch (err) {
        console.err()
    }
}

const User = mongoose.model("User", userSchema);

export { createUser, verifyUser, saveGame, deleteGame, editUser, deleteUser, User }