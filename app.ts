const port = 1907;

import express from 'express';

const app = express();

import bitcoinRoute from './routes/bitcoin.routes';

import { validationError, notFoundError } from './middlewares/error.middleware';

import { config } from 'dotenv';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

config();

app.use('/bitcoin', bitcoinRoute);

app.use(validationError);
app.use(notFoundError);

app.listen(port, () => {
    console.log(`Bitcoin Service started at http://127.0.0.1:${port}`)
})