import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false
    }),
    { bufferLogs: true }
  )

  const logger = app.get(Logger)

  app.useLogger(logger)

  const port = process.env.PORT || 3000
  await app.listen(port, '0.0.0.0')

  logger.log(`🚀  http://0.0.0.0:${port}`, 'Bootstrap')
  logger.log(`📖  Docs   → http://localhost:${port}/docs`, 'Bootstrap')
  logger.log(`❤️  Health → http://localhost:${port}/health`, 'Bootstrap')
}

bootstrap()
