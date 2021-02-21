import moment from 'moment'
import { config } from 'node-config-ts'
import { Request, Response, NextFunction } from 'express'
import caller from 'caller'
import path from 'path'
import fs from 'fs'

export default class wLogger {
    private loggerLocation: string
    private logFolderPath: string
    private logFilePath: string
    private enableConsoleLog: boolean
    private enableFileLog: boolean
    private expressMiddlewareOption: { logRequest: boolean, logResponse: boolean }

    public readonly logLevel = {
        info: "INFO",
        debug: "DEBUG",
        warning: "WARN",
        error: "ERROR"
    }

    public readonly adapters = {
        start: "START",
        end: "END",
        error: "ERROR"
    }

    constructor() {
        this.setup()
    }

    log(logLevel: string, message: any, keyName?: string, keyValue?: string) {
        const level = this.validateLevel(logLevel)
        const logString = `${this.writeFileLocation()} ${this.writeTrackDetails(keyName, keyValue)} ${this.formatMessage(message)}`
        this.makeLog(level, logString)
    }

    adapter(type: string, {ip, method, originalUrl, protocol, query, headers, body}) {
        const adapterType = this.validateAdapter(type)
        const logLevel = (type === 'ERROR') ? this.logLevel.error : this.logLevel.info
        const request = { query, headers, body }
        const requestStr = JSON.stringify(request, null, ' ')
        const logString = `${ip} ${method} ${originalUrl} ${protocol} ${requestStr}`
        this.log(logLevel, logString)
    }

    expressMiddleware(req: Request, res: Response, next: NextFunction) {
        if (this.expressMiddlewareOption.logRequest === true)
            this.adapter('START', req)

        if (this.expressMiddlewareOption.logResponse === true){
            //this.adapter('START', req)
            let send = res.send;
            res.send = function(body, logFunction:any = this.adapter): typeof res.send{
                logFunction('END',body)
                send.call(this, body)
                return res.send
            }
        }
            
    }

    private makeLog(logLevel: string, logString: string) {
        const logMessage = `[${moment().format()}] [${logLevel}] ${logString}`
        this.printLog(logMessage)
        this.writeLog(logMessage)
    }

    private writeLog(logMessage: string) {
        if (!this.enableFileLog) return
        if (!fs.existsSync(this.logFolderPath)) {
            fs.mkdirSync(this.logFolderPath, {
                recursive: true
            });
        }
        fs.appendFileSync(this.logFilePath, logMessage + '\n')
    }
    private printLog(logMessage: string) {
        if (this.enableConsoleLog)
            console.log(logMessage)
    }

    private writeFileLocation() {
        if (this.loggerLocation !== "")
            return `[${this.loggerLocation}]`
    }

    private writeTrackDetails(keyName?: string, keyValue?: string) {
        return (keyName || keyValue) ? `[keyName:${keyName ?? '""'} keyValue:${keyValue ?? '""'}]` : ""
    }

    private formatMessage(message: any) {
        return JSON.stringify(message, null, 0).replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
    }

    private validateLevel(level: string): string {
        if (Object.values(this.logLevel).indexOf(level) === -1) {
            this.log(this.logLevel.warning, `${level} is not a supported value and was replace by ${this.logLevel.info}`)
            return this.logLevel.info
        }
        return level
    }

    private validateAdapter(adapter: string): string {
        if (Object.values(this.adapters).indexOf(adapter) === -1) {
            this.log(this.logLevel.warning, `${adapter} is not a supported value`)
            return 'undefined'
        }
        return adapter
    }

    private setup() {
        const cfg = config.wLogger

        const filename = `${cfg.fileNameFormat}`.replace('[TS]', moment().format(cfg.fileNameTimeStampFormat))
        this.logFolderPath = path.join(path.resolve('./'), cfg.location)
        this.logFilePath = path.join(this.logFolderPath, filename)

        this.enableConsoleLog = cfg.enableConsoleLog
        this.enableFileLog = cfg.enableFileLog

        this.loggerLocation = (cfg.enableOriginFileLog == true) ? caller(2).replace(path.resolve('./'), "") : ""

        this.expressMiddlewareOption = { logRequest: cfg.express.enableRequestLog, logResponse: cfg.express.enableResponseLog }
    }

}