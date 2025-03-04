import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import collectionRoutes from '../src/routes/collectionRoutes.js';
import searchRoutes from '../src/routes/searchRoutes.js';
import settingsRoutes from '../src/routes/settingsRoutes.js';
import userRoutes from '../src/routes/userRoutes.js';

dotenv.config();
const app = express();

const port = 5000;


app.use(cors()); 
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/collection', collectionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/user', userRoutes);

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on ${port}`)
    }
    else { "Error occurred, server can't start", error }
})

export default app;