// Imports
const express       = require('express');
const path          = require('path');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');

require ("dotenv").config(); // Loads environment variables from .env file


// Routes
const userRoutes    = require('./routes/user');
const postRoutes    = require('./routes/post');
const likeRoutes    = require('./routes/like');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users',       userRoutes);
app.use('/api/posts',       postRoutes);
app.use('/api',             likeRoutes);
app.use('/api/comments',    commentRoutes);

module.exports = app;