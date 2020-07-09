import db from './src/models/index';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./src/api/routes/userRoutes.js');

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my app!' });
});

const PORT = process.env.port || 8081;


db.sequelize.sync();

app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
