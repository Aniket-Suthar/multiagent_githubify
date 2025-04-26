const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('../routes/router')
dotenv.config();

const connectDB = require('../config/connectDB');

const app = express();

// Enable CORS middleware
app.use(cors({ origin: true, credentials: true, exposedHeaders: ["Set-Cookie"] }));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
app.set("trust proxy")
app.enable('trust proxy')
connectDB()
    .then(() => {
        app.listen(5001, () => {
            console.log("Server is running on port 5001");
        });
    })
    .catch((err) => {
        console.log(err);
    })