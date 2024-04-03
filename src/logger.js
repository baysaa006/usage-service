import fs from 'fs';
import path from 'path';

export const createNewLogFile = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const logFileName = `log_${formattedDate}.txt`;
    return path.join("../", 'logs', logFileName);
};

export const writeLog = (logFilePath, message) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        console.error('message:', logMessage);

        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
};