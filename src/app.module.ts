import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { ConfigKeyPaths, configs, AppConfig } from '~/config'
import { RedisModule } from '~/redis/redis.module'
import { HealthModule } from '~/health/health.module'
import { createLoggerOptions } from './bootstrap/logger'

const mode = process.env.MODE ?? 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [`.env.local`, `.env.${mode}`, '.env'],
      load: [...configs]
    }),

    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigKeyPaths>) => {
        const { logLevel, isDev } = config.get<AppConfig>('app')!
        return createLoggerOptions(logLevel, isDev)
      }
    }),

    RedisModule,
    HealthModule
  ]
})
export class AppModule {}
