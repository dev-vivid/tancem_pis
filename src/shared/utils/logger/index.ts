import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Function to create transport for each type of log
function createDailyRotateFileTransport(logDirectoryName:string, level:string) {
	return new DailyRotateFile({
		level: level,
		dirname: `./logs/${logDirectoryName}`,
		filename: `%DATE%-${level}-logs.log`,
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d',  // Rotate files after 14 days
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.json()
		)
	});
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console({
			level: 'info'
		}),
		createDailyRotateFileTransport('api', 'info'),
		createDailyRotateFileTransport('errors', 'error')
	]
});

export default logger;
