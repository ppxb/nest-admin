import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => {
        return {
          pinoHttp: {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                messageFormat: '[{context}] {msg}',
                ignore: 'hostname,context'
              }
            }
          }
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
