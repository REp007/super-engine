import { createLogger, format, transports } from "winston"

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.prettyPrint(),
    ),
    defaultMeta: { service: 'user-service' },

    transports: [
        // new transports.Console(),
        new transports.File({ filename: 'log/combined.log' }),
        new transports.File({ filename: 'log/error.log', level: 'error' }),
    ],
});

export default logger;
