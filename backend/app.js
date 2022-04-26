// Imports
const express       = require('express');
const path          = require('path');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');

// Security imports
require ("dotenv").config(); // Loads environment variables from .env file
const helmet = require("helmet"); // A collection of 13 middleware functions for setting HTTP response headers
const rateLimit = require ('express-rate-limit'); // Protect the system against brute force

// Routes
const userRoutes    = require('./routes/user');
const postRoutes    = require('./routes/post');
const likeRoutes    = require('./routes/like');
const commentRoutes = require('./routes/comments');

const app = express();
app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // Disables the "Cross-Origin Resource Sharing" header
    })
  );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); // Prevents CORS errors with Helmet 5
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message : "Vous avez atteint le nombre de requête maximum, merci de réessayer dans un instant."
})

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users',   apiLimiter,   userRoutes);
app.use('/api/posts'              ,   postRoutes);
app.use('/api'                    ,   likeRoutes);
app.use('/api/comments'           ,   commentRoutes);

module.exports = app;