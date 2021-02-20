import wLogger from '../'

const logger = new wLogger()

logger.log(logger.logLevel.info, {id: 1, message: "Some message"})
logger.log(logger.logLevel.debug, {id: 2, message: "Debug"}, "NAME")
logger.log(logger.logLevel.warning, {id: 3, message: "Danger action"}, "", "VALUE")
logger.log(logger.logLevel.error, "Some message", "NAME", "VALUE")
logger.log("NO LEVEL", "Some message", "NAME", "VALUE")
logger.log(logger.logLevel.info, [1,2,3,4])