const config = require('./utils/config')
const app = require('./app')
const logger = require('./utils/logger')
const http = require('http')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`Server is running on ${config.PORT} port`)
})