import { AppConfig, appConfig } from './app.config'
import { redisConfig, RedisConfig } from './redis.config'

export * from './app.config'
export * from './redis.config'

export const configs = [appConfig, redisConfig]

type ConfigMap = {
  app: AppConfig
  redis: RedisConfig
}

export type ConfigKeyPaths = RecordNamePaths<ConfigMap>

export default { appConfig, redisConfig }
