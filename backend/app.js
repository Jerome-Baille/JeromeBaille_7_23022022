// Imports
var express      = require('express');
const path = require('path');
const auth = require('./middleware/auth');
var bodyParser  = require('body-parser');

// Routes
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;