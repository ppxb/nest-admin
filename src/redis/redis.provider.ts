import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import IORedis from 'ioredis'

import { RedisConfig } from '~/config/redis.config'
import { REDIS } from '~/shared/constants/inject-tokens'

export type RedisClient = IORedis

export const redisProvider: Provider = {
  provide: REDIS,
  inject: [ConfigService],
  useFactory: (config: ConfigService): RedisClient => {
    const { host, port, password, db } = config.get<RedisConfig>('redis')!
    return new IORedis({
      host,
      port,
      ...(password ? { password } : {}),
      db,
      maxRetriesPerRequest: 3,
      retryStrategy: () => null
    })
  }
}
