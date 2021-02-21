import core from './core'

export default class wLogger {
    
    private core: core

    public readonly logLevel = {
        info: "INFO",
        debug: "DEBUG",
        trace: "TRACE",
        warning: "WARN",
        error: "ERROR"
    }

    public readonly adapters = {
        start: "START",
        end: "END",
        error: "ERROR"
    }

    constructor(){
        this.core = new core()
    }

    log(logLevel: string, message: any, keyName?: string, keyValue?: string) {
        const level = this.validateLevel(logLevel)
        const logString = `${this.core.writeFileLocation()} ${this.core.writeTrackDetails(keyName, keyValue)} ${this.core.formatMessage(message)}`
        this.core.makeLog(level, logString)
    }

    adapter(type: string, message: any) {
        const adapterType = this.validateAdapter(type)
        const logLevel = (type === 'ERROR') ? this.logLevel.error : this.logLevel.info
        const adapterMsg = JSON.stringify(message, null, ' ')
        const logString = `[ADAPTER_${adapterType}] ${adapterMsg}`
        this.core.makeLog(logLevel, logString)
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
}