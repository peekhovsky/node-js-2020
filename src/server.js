import dotenv from 'dotenv';
import db from './models';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './api/userRoutes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/users', userRoutes);
db.sequelize.sync();

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
