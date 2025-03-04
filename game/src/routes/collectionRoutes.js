import { User, saveGame, deleteGame } from '../models/userModel.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const payload = jwt.verify(req.token, process.env.Secret_Key);
        const user = await User.findOne({ username: payload.sanitizedUser.username }).exec();
        if (!user) {
            return res.status(403).json({ message: 'User not found.' });
        }

        return res.status(201).json({ collection: user.gameCollection });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' })
        }
        else if (err instanceof mongoose.Error) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error. Please try again later.' });
        }

        return res.status(403).json({ message: 'Unauthorized access.' });
    }
});

router.post('/addGame', verifyToken, async (req, res) => {
    try {
        const payload = jwt.verify(req.token, process.env.Secret_Key);
        const user = await User.findOne({ username: payload.sanitizedUser.username }).exec();
        if (!user) {
            return res.status(403).json({ message: 'User not found.' });
        }
        const { id, name, rating, cover, genres, platforms, platform, summary, screenshots, condition } = req.body;
        const status = await saveGame(user, id, rating, summary, name, genres, platforms, platform, screenshots, cover, condition);
        if (!status) {
            return res.status(409).json({ message: 'Game already exists.' })
        }
        return res.status(200).json({ message: 'Game saved.' })

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' })
        }
        else if (err instanceof mongoose.Error) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error. Please try again later.' });
        }

        return res.status(403).json({ message: 'Unauthorized access.' });
    }

})

router.post('/deleteGame', verifyToken, async (req, res) => {
    try {
        const payload = jwt.verify(req.token, process.env.Secret_Key);
        const user = await User.findOne({ username: payload.sanitizedUser.username }).exec();
        if (!user) {
            return res.status(403).json({ message: 'User not found.' });
        }
        const gameId = req.body.id;
        const status = deleteGame(user, gameId);
        if (status) {
            return res.status(200).json({ collection: user.gameCollection });
        }

        return res.status(404).json({ message: "Resource not found." });
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' })
        }
        else if (err instanceof mongoose.Error) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error. Please try again later.' });
        }
        return res.status(403).json({ message: 'Unauthorized access.' });
    }
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        return next();
    }
    else {
        return res.status(403).send('Forbidden');
    }
};

export default router;