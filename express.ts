import { config } from 'node-config-ts'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidV4 } from 'uuid';
import logger from './logger'

export { expressMiddleware, adapterStart, adapterEnd }

function expressMiddleware(req: Request, res: Response, next: NextFunction) {
    const cfg = config.LoggerW

    if(cfg.ids.request.enable === true)
        res.set(cfg.ids.request.header,uuidV4())

    if(cfg.ids.correlation.enable === true){
        const correlationId = req.headers[cfg.ids.correlation.header] ?? uuidV4()
        res.set(cfg.ids.correlation.header,correlationId)
    }

    if (cfg.express.enableRequestLog === true)
        adapterStart(req)

    if (cfg.express.enableResponseLog === true) {
        let originalExpressResponseSend = res.send;
        // @ts-ignore: Unreachable code error
        res.send = (body): typeof res.send => {
            adapterEnd(req, res, body)
            originalExpressResponseSend.call(res, body)
        }
    }

    next()
}

function adapterStart(req: Request) {
    const ip = req.ip
    const method = req.method
    const uri = req.originalUrl
    const protocol = req.protocol
    const request = {
        query: req.query,
        headers: req.headers,
        body: req.body
    }
    const requestStr = JSON.stringify(request, null, ' ')
    const logString = `${ip} ${protocol} ${method} ${uri} ${requestStr}`
    const log = new logger()
    log.adapter(log.adapters.serviceStart, logString)
}

function adapterEnd(req: Request, res: Response, responseBody: any) {
    const ip = req.ip
    const method = req.method
    const uri = req.originalUrl
    const protocol = req.protocol
    const statusCode = res.statusCode
    const response = {
        header: JSON.stringify(res.getHeaders()),
        body: JSON.stringify(responseBody)
    }
    const responseStr = JSON.stringify(response, null, ' ')
    const logString = `${ip} ${protocol} ${method} ${uri} ${statusCode} ${responseStr}`
    const log = new logger()
    log.adapter(log.adapters.serviceEnd, logString)
} 