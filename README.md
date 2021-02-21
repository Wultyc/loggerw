# LoggerW
LoggerW is an advanced library to make logs on your application. It is written in TypeScript and its compatible with almost every project built in node.js and built-in middleware for [express.js](https://www.npmjs.com/package/express)

## Features
- Log on console and text file
- Native express.js middleware
- Simple way to make logs professional looking logs inside your application
- Information about what file called the logger
- KeyName and KeyValue fields for tracking

## Installation
Install LoggerW NPM package
```sh
npm install loggerw
``` 
Then create your settings file based on this example.
```json
{
    "LoggerW" : {
        "logFile":{
            "location": "/logs",
            "fileNameFormat":"[TS].log",
            "fileNameTimeStampFormat":"YYYYMMDD",
            "enableOriginFileLog": true,
            "enableFileLog": true,
            "enableConsoleLog": true
        },
        "express": {
            "enableRequestLog": true,
            "enableResponseLog": true
        },
        "ids":{
            "request": {
                "enable": true,
                "header": "x-request"
            },
            "correlation": {
                "enable": true,
                "header": "x-request"
            }
        }
    }
}
```
Learn more about this file on **Settings File** chapter bellow.
### Usage
#### Express Middleware
To enable the middleware you just need to import the library and add it to your application
```js
import {expressLogger} from 'loggerw'
import express from 'express'
const app = express()
app.use(expressLogger.expressMiddleware)
```
Combined with the default settings this will log all request and corresponding response of your application.
```log
[2021-02-21T17:04:36+00:00] [INFO] [SERVICE_START] "::1 http GET / {\n \"query\": {},\n \"headers\": {\n  \"user-agent\": \"PostmanRuntime/7.26.10\",\n  \"accept\": \"*/*\",\n  \"postman-token\": \"c816ae78-3240-47d5-ba85-ffe23632ca2b\",\n  \"host\": \"localhost:3000\",\n  \"accept-encoding\": \"gzip, deflate, br\",\n  \"connection\": \"keep-alive\"\n }\n}"
...
[2021-02-21T17:04:36+00:00] [INFO] [SERVICE_END] "::1 http GET / 200 {\n \"header\": \"{\\\"x-powered-by\\\":\\\"Express\\\",\\\"x-request\\\":\\\"d0157889-8633-47b5-80a2-2e8573adf535\\\"}\",\n \"body\": \"\\\"Hello World!\\\"\"\n}"
```
This middleware make 2 logs: Adapter Start and Adapter End
- Adapter Start: Log the information that reach the application such as IP address, protocol, HTTP verb, endpoint, query params, request headers and body.
- Adapter End: Log the information that reach the application such as IP address, protocol, HTTP verb, endpoint, response status code, headers and body.

#### General use logger
Besides express, you can create your own logs based on generic logs and adapters
##### Generic logs
The method to create a generic log is 
```js
log(Log Level, Log Message, [KeyName, [KeyValue]])
```
The possible values for Log Level are
- INFO
- DEBUG
- TRACE
- WARNING
- ERROR

And they are available from `logLevel` property.

To use this you need to import the default module, instanciaste it and then create your log
```js
import logger from 'wLogger'
const log = new logger()
log.log(log.logLevel.info, "Making a log on / endpoint")
```
This will generate the following result
```log
[2021-02-21T17:04:36+00:00] [INFO] [\index.ts]  "Logging some information on / endpoint"
```
If you send two more string values, they will assume the values of `KeyName` and  `KeyValue`
e.g The following code 
```js
log.log(log.logLevel.info, "Making a log on / endpoint", "userId", "1000")
```
Will generate the following log
```log
[2021-02-21T17:04:36+00:00] [INFO] [\index.ts] [keyName:userId keyValue:1000] "Logging some information on / endpoint"
```

##### Adapters
The method to create a generic log is 
```js
adapter(Adapter Type, Log Message)
```
The possible values for Log Level are
- ADAPTER_START
- ADAPTER_END
- ADAPTER_ERROR
- SERVICE_START
- SERVICE_ERROR

And they are available from `adapters` property.

To use this you need to import the default module, instanciaste it and then create your log
```js
import logger from 'wLogger'
const log = new logger()
log.adapter(log.adapters.start, "127.0.0.1 HTTP GET /page {query: {}, header:{}, body:{}}")
```
This will generate the following result
```log
[2021-02-21T17:04:36+00:00] [ADAPTER_START]  "127.0.0.1 HTTP GET /page {query: {}, header:{}, body:{}}"
```
> This function is used on express.js middleware to provide Service Start/End log messages

## Settings File
Settings file is used to provide some customization on the logger on your application. This uses the module [node-config-ts](https://www.npmjs.com/package/node-config-ts). You can add more configurations to this file besides, you just need to guarantee the `loggerW` settings are in place.

| Field                       | Description                            | Possible Values     |
|-----------------------------|----------------------------------------|---------------------|
| LoggerW                     | Root element                           |                     |
|   logFile                   | Log file related settings              |                     |
|     location                | Location from your project root        | Any valid location  |
|     fileNameFormat          | Log filename template                  | Any valid file name |
|     fileNameTimeStampFormat | Timestamp on log filename              | Any valid format allowed for [moment](https://www.npmjs.com/package/moment) module. This value will replace `[TS]` on your filename|
|     enableOriginFileLog     | Used to show what file called logger   | true/false          |
|     enableFileLog           | Enable writing the logs on file        | true/false          |
|     enableConsoleLog        | Enable writing the logs on console     | true/false          |
|   express                   | Express.JS middleware related settings |                     |
|     enableRequestLog        | Enable service start log               | true/false          |
|     enableResponseLog       | Enable service end log                 | true/false          |
|   ids                       | Ids related settings                   |                     |
|     request id              | Request id related settings            |                     |
|       enable                | Enable request id management           |                     |
|       header                | Header name used for request id        |                     |
|     correlation id          | Correlation id related settings        |                     |
|       enable                | Enable correlation id management       |                     |
|       header                | Header name used for correlation id    |                     |