import chalk from 'chalk'
import winston from 'winston'

const { combine, timestamp, printf, errors, json } = winston.format

const levels = {
	error: 0,
	warn: 1,
	debug: 2,
	http: 3,
	verbose: 4,
	silly: 5,
	info: 6,
	success: 7,
}

const colors = {
	error: chalk.redBright.bold,
	warn: chalk.yellowBright.bold,
	debug: chalk.black.bgWhite,
	http: chalk.magentaBright.bold,
	verbose: chalk.white.bgBlue,
	silly: chalk.white.bgMagenta,
	info: chalk.cyan,
	success: chalk.greenBright.bold,
}

const loggerFormat = printf(({ level, message, timestamp }) => {
	const color = colors[level as keyof typeof colors]
	return color(`${timestamp} [${level.toUpperCase()}]: ${message}`)
})

const createLogger = (level: keyof typeof levels, filename: string) => {
	return winston.createLogger({
		levels,
		level,
		format: combine(
			timestamp({ format: 'ddd MMM Do YYYY [at] hh:mm:ss A' }),
			errors({ stack: true }),
			loggerFormat
		),
		transports: [
			new winston.transports.File({
				filename,
				format: winston.format.combine(json()),
			}),
		],
	}) as winston.Logger & Record<keyof typeof levels, winston.LeveledLogMethod>
}

export const warmLogger = createLogger('verbose', 'ca-warn.json')

export const greenLogger = createLogger('success', 'ca-green.json')

if (process.env.NODE_ENV !== 'production') {
	warmLogger.add(new winston.transports.Console())
	greenLogger.add(new winston.transports.Console())
}
