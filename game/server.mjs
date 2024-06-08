import express from 'express';
import dotenv from 'dotenv';
// Resolve the path to the .env file
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the path to the .env file
const envPath = resolve(__dirname, '../.env');

// Load the .env file
dotenv.config({ path: envPath });
// Load the .env file
import cors from 'cors';
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';

import * as users from './src/models/user_model.mjs';
const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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
// body: `search "${search}"; limit 500; fields rating, cover.*, release_date, genres.name, name, platforms.name, screenshots.*, summary;`


app.post('/search', (req, res) => {
    console.log(process.env.Authorization);

    const url = new URL('https://api.igdb.com/v4/games');
    const search = req.body.search;

    fetch(url, {
        method: 'POST',
        headers: {
            'Client-ID': process.env.Client_ID,
            'Authorization': process.env.Authorization,
        },
        body: `search "${search}"; limit 500; fields rating, cover.*, release_dates.human, release_dates.platform.name, release_dates.region, genres.name, name, platforms.name, screenshots.*, summary;`

    }).then(response => {
        if (!response.ok) {
            console.log('Error response status code:', response.status);
        }
        else {

            return response.json(); // parse the JSON response
        }
    }).then(data => {
        res.json(data);
    })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});


app.post('/users',
    body('username')
        .custom(isUsernameValid)
        .withMessage('Invalid username'),
    body('emailAddress')
        .custom(isEmailAddressValid)
        .withMessage('Invalid email address'),
    body('password')
        .custom(isPasswordValid)
        .withMessage('Invalid password'),
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, emailAddress, password } = req.body;

        try {
            // Check for duplicates in parallel
            const [usernameDuplicate, emailDuplicate] = await Promise.all([
                users.User.findOne({ username }),
                users.User.findOne({ emailAddress })
            ]);

            // If any duplicates are found, respond with a 409 Conflict status
            if (!usernameDuplicate && !emailDuplicate) {
                const newUser = new users.User({ username, emailAddress, password });
                await newUser.save();
    
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

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on ${port}`)
    }
    else { "Error occurred, server can't start", error }
})