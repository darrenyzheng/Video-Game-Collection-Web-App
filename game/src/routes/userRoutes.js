import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { User, createUser } from '../models/userModel.js';
import { body, validationResult} from 'express-validator';

const router = Router();

router.post('/register',
    body('username')
        .custom(isUsernameValid)
        .withMessage('Invalid username'),
    body('password')
        .custom(isPasswordValid)
        .withMessage('Invalid password'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, emailAddress, password } = req.body;

        try {
            const [usernameDuplicate, emailDuplicate] = await Promise.all([
                User.findOne({ username }),
                User.findOne({ emailAddress })
            ]);

            if (!usernameDuplicate && !emailDuplicate) {
                const newUser = await createUser(username, emailAddress, password);
                return res.status(201).json({ message: 'User registered successfully', user: newUser });
            }

            let duplicates = {};
            if (usernameDuplicate) {
                duplicates.username = 'This username already exists, please pick another username.';
            }
            if (emailDuplicate) {
                duplicates.emailAddress = 'This email already exists, please pick another email address.';
            }
            return res.status(409).json({ duplicates });

        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Server error', details: error.message });
        }
    }
);

router.post('/login',
    body('username')
        .custom(isUsernameValid)
        .withMessage('Invalid username'),
    body('password')
        .custom(isPasswordValid)
        .withMessage('Invalid password'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { username, password } = req.body;
            const user = await User.login(username, password);
            if (!user) {
                return res.status(401).json({});
            }

            const sanitizedUser = { username: user.username }
            jwt.sign({ sanitizedUser }, process.env.Secret_Key, { expiresIn: '3d' }, (err, token) => {
                return res.status(201).json({ token });
            })


        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ error: 'Server error', details: error.message });
        }
    }
);

function isUsernameValid(username) {
    const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
    return usernameRegex.test(username);
}

function isEmailAddressValid(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isPasswordValid(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;
    return passwordRegex.test(password);
}

export default router;