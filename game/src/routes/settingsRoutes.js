import { Router } from 'express';
import { User, editUser } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { body} from 'express-validator';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const payload = jwt.verify(req.token, process.env.Secret_Key);
        const user = await User.findOne({ username: payload.sanitizedUser.username }).exec();
        if (!user) {
            return res.status(403).json({ message: 'User not found.' });
        }

        return res.status(201).json({ user: user });
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

router.post('/', verifyToken,
    body('emailAddress')
        .custom(isEmailAddressValid)
        .withMessage('Invalid email address'),
    body('password')
        .custom(isPasswordValid)
        .withMessage('Invalid password'),
    async (req, res) => {
        try {
            const payload = jwt.verify(req.token, process.env.Secret_Key);
            const user = await User.findOne({ username: payload.sanitizedUser.username }).exec();
            if (!user) {
                return res.status(403).json({ message: 'User not found.' });
            }
            const newPassword = req.body.password;
            delete req.body.password;
            const status = await editUser(user, req.body, newPassword);
            if (status) {
                return res.status(200).json({ 'message': 'Account details successfully updated.' })
            }
            return res.status(409).json({ 'message': 'Email already exists.' })

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
    });

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

function isEmailAddressValid(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isPasswordValid(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;
    return passwordRegex.test(password);
}

export default router;
