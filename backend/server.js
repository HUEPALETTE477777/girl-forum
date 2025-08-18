const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config()

const DB_CONNECTION = require('./config/mDB');
DB_CONNECTION();

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/posts', require('./routes/PostRoutes'));
app.use('/api/friends', require('./routes/FriendshipRoutes'));
app.use('/api/comment', require('./routes/CommentRoutes'))

const port = process.env.PORT || 6666;
app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`));

module.exports = app;





