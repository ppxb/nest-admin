import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { AppConfig, appConfig } from '~/config/app.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

const mode = process.env.MODE ?? 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [`.env.local`, `.env.${mode}`, '.env'],
      load: [appConfig]
    }),

    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { logLevel, isDev } = config.get<AppConfig>('app', { infer: true })

        return {
          pinoHttp: {
            level: logLevel,
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    messageFormat: '[{context}] {msg}',
                    ignore: 'hostname,context'
                  }
                }
              : undefined
          }
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
