import Winston from 'winston';

const loggingLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        sql: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'cyan',
        sql: 'magenta'
    }
};

const filterLevel = (level) =>
    Winston.format((info) => {
        if (info.level !== level) {
            return false;
        }
        return info;
    })();

Winston.addColors(loggingLevels.colors);

const logger = Winston.createLogger({
    transports: [
        new Winston.transports.Console({
            level: 'debug',
            format: Winston.format.combine(
                Winston.format.colorize(),
                Winston.format.timestamp(),
                Winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
            )
        }),
        new Winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'info.log',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.prettyPrint()
            )
        }),
        new Winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'exception.log',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.prettyPrint()
            )
        }),
        new Winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.prettyPrint()
            )
        }),
        new Winston.transports.File({
            level: 'sql',
            dirname: 'logs',
            filename: 'sql.log',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.prettyPrint(),
                filterLevel('sql')
            )
        })
    ],

    levels: loggingLevels.levels
});

export default logger;
