import { appConfig } from './app.config'
import { redisConfig } from './redis.config'

export * from './app.config'
export * from './redis.config'

export const configs = [appConfig, redisConfig]

export default { appConfig, redisConfig }
