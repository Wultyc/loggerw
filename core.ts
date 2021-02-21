import moment from 'moment'
import { config } from 'node-config-ts'
import caller from 'caller'
import path from 'path'
import fs from 'fs'

export default class core {

    private loggerLocation: string
    private logFolderPath: string
    private logFilePath: string
    private enableConsoleLog: boolean
    private enableFileLog: boolean

    constructor() {
        this.setup()
    }

    makeLog(logLevel: string, logString: string) {
        const logMessage = `[${moment().format()}] [${logLevel}] ${logString}`
        this.printLog(logMessage)
        this.writeLog(logMessage)
    }

    formatMessage(message: any) {
        return JSON.stringify(message, null, 0).replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
    }

    writeFileLocation() {
        if (this.loggerLocation !== "")
            return `[${this.loggerLocation}]`
    }

    writeTrackDetails(keyName?: string, keyValue?: string) {
        return (keyName || keyValue) ? `[keyName:${keyName ?? '""'} keyValue:${keyValue ?? '""'}]` : ""
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

    private setup() {
        const cfg = config.wLogger.logFile

        const filename = `${cfg.fileNameFormat}`.replace('[TS]', moment().format(cfg.fileNameTimeStampFormat))
        this.logFolderPath = path.join(path.resolve('./'), cfg.location)
        this.logFilePath = path.join(this.logFolderPath, filename)

        this.enableConsoleLog = cfg.enableConsoleLog
        this.enableFileLog = cfg.enableFileLog

        this.loggerLocation = (cfg.enableOriginFileLog == true) ? caller(3).replace(path.resolve('./'), "") : ""
    }

}