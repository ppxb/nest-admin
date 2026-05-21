import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from './health.controller'
import { RedisIndicator } from './indicators/redis.indicator'

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [RedisIndicator]
})
export class HealthModule {}
