import moment from 'moment'
import { config } from 'node-config-ts'
import caller from 'caller'
import path from 'path'
import fs from 'fs'

export default class wLogger {
    private loggerLocation: string
    private logFolderPath: string
    private logFilePath: string
    private enableConsoleLog: boolean
    private enableFileLog: boolean

    public readonly logLevel = {
        info: "INFO",
        debug: "DEBUG",
        warning: "WARN",
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

    private setup() {
        const cfg = config.wLogger

        const filename = `${cfg.fileNameFormat}`.replace('[TS]', moment().format(cfg.fileNameTimeStampFormat))
        this.logFolderPath = path.join(path.resolve('./'), cfg.location)
        this.logFilePath = path.join(this.logFolderPath, filename)

        this.enableConsoleLog = cfg.enableConsoleLog
        this.enableFileLog = cfg.enableFileLog

        this.loggerLocation = (cfg.enableOriginFileLog == true) ? caller(2).replace(path.resolve('./'), "") : ""
    }

}