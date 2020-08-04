import ExpressWinston from 'express-winston';
import winstonInstance from '../logger/winstonLogger.js';

const requestWhiteList = ExpressWinston.requestWhitelist;
requestWhiteList.push('body');

export const requestLogger = ExpressWinston.logger({
    winstonInstance,
    metaField: 'metadata',
    requestWhitelist: requestWhiteList,
    msg: 'Method: {{req.method}}, url: {{req.url}}, status: {{res.statusCode}}.'
});
