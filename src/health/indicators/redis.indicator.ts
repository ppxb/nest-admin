import { Inject, Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'

import type { RedisClient } from '~/redis/redis.provider'
import { REDIS } from '~/shared/constants/inject-tokens'

@Injectable()
export class RedisIndicator {
  constructor(
    @Inject(REDIS) private readonly redis: RedisClient,
    private readonly healthIndicator: HealthIndicatorService
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicator.check(key)

    try {
      const pong = await this.redis.ping()
      if (pong !== 'PONG') return indicator.down({ error: `Unexpected PING response: ${pong}` })

      return indicator.up()
    } catch (err) {
      return indicator.down({ error: String(err) })
    }
  }
}
