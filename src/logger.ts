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
        new transports.File({ filename: 'combined.log' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

export default logger;
