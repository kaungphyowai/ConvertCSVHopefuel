import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Function to create a new logger with a dynamic log file
function createLogger() {
  const logDir = path.join(process.cwd(), 'logs');
  
  // Ensure the log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  // Create a log file with a unique name (e.g., using a timestamp)
  const logFile = path.join(logDir, `app-${new Date().toISOString().replace(/:/g, '-')}.log`);

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: logFile })
    ]
  });
}

export default createLogger;