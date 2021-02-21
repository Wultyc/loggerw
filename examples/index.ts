import wLogger from '../'

const logger = new wLogger()

logger.log(logger.logLevel.info, {id: 1, message: "Some message"})
logger.log(logger.logLevel.debug, {id: 2, message: "Debug"}, "NAME")
logger.log(logger.logLevel.warning, {id: 3, message: "Danger action"}, "", "VALUE")
logger.log(logger.logLevel.error, "Some message", "NAME", "VALUE")
logger.log("NO LEVEL", "Some message", "NAME", "VALUE")
logger.log(logger.logLevel.trace, [1,2,3,4])
logger.adapter(logger.adapters.adapterStart, "127.0.0.1 HTTP GET /page {query: {}, header:{}, body:{}}")
logger.adapter(logger.adapters.adapterEnd, "127.0.0.1 HTTP GET /page {query: {}, header:{'x-correlation':'0000','x-request':'0000'}, body:{'status': 'ok','message': 'Success','detail': 'Dummy message'}}")
logger.adapter(logger.adapters.serviceStart, "127.0.0.1 HTTP GET /page {query: {}, header:{}, body:{}}")
logger.adapter(logger.adapters.serviceEnd, "127.0.0.1 HTTP GET /page {query: {}, header:{'x-correlation':'0000','x-request':'0000'}, body:{'status': 'ok','message': 'Success','detail': 'Dummy message'}}")