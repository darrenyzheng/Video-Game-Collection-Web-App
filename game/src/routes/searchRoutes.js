import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.post('/', (req, res) => {

    const url = new URL('https://api.igdb.com/v4/games');
    const search = req.body.search;

    fetch(url, {
        method: 'POST',
        headers: {
            'Client-ID': process.env.Client_ID,
            'Authorization': process.env.Authorization,
        },
        body: `search "${search}"; limit 500; fields rating, cover.*, genres.name, name, platforms.name, screenshots.*, summary;`

    }).then(response => {
        if (!response.ok) {
            console.log('Error response status code:', response.status);
        }
        else {
            return response.json(); 
        }
    }).then(data => {
        res.json(data);
    })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

export default router;