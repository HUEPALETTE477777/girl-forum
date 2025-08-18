const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MONGODB CONNECTION ESTABLISHED');
    } catch (err) {
        console.log(err);
    }
}

module.exports = dbConnection;
