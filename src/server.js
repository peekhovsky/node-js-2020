import dotenv from 'dotenv';
import db from './models';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './api/userRoutes';
import groupRoutes from './api/groupRoutes';
import { requestLogger } from './middleware/requestLoggingMiddleware.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
db.sequelize.sync();

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
