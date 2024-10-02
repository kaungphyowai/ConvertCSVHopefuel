import winston from 'winston';
import path from 'path';

// Create a new log file with a timestamp on each run
const getLogFileName = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `app-${timestamp}.log`;  // e.g., 'app-2024-10-01T08-30-45.log'
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    // Dynamically create a log file with a unique name for each run
    new winston.transports.File({ filename: path.join('logs', getLogFileName()) }),
    new winston.transports.Console()
  ]
});

// Export the logger so that it can be used in other files
export default logger;