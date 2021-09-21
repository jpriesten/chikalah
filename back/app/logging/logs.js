'use strict'
const winston = require('winston')
const expressWinston = require('express-winston')

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const consoleLog = new winston.transports.Console()

module.exports = {
    requestLogger: expressWinston.logger({
        transports: [
          new winston.transports.Console()
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        )
    }),
    errorLogger: expressWinston.errorLogger({
        transports: [
          new winston.transports.Console()
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        )
    })
}
