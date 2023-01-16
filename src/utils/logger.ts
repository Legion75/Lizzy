import logger from 'pino'
import dayjs from 'dayjs'
import config from 'config'

const level = config.get<string>('loglevel');

const log = logger({
    transport:{
        target: 'pino-pretty',
    },
    level : level,
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;