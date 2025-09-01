const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config()

const DB_CONNECTION = require('./config/mDB');
DB_CONNECTION();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, 
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/posts', require('./routes/PostRoutes'));
app.use('/api/friends', require('./routes/FriendshipRoutes'));
app.use('/api/comment', require('./routes/CommentRoutes'))
app.use('/api/reels', require('./routes/ReelRoutes'));

const port = process.env.PORT || 6666;
app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`));

module.exports = app;





