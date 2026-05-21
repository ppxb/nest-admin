import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'
import { AppConfig } from '~/config/app.config'
import { setupFastify } from '~/bootstrap/fastify'
import { ZodValidationPipe } from '~/shared/pipes/zod-validation.pipe'

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

  const config = app.get(ConfigService)
  const { port, globalPrefix, isDev } = config.get<AppConfig>('app')!

  await setupFastify(app)

  app.useGlobalPipes(new ZodValidationPipe())

  app.setGlobalPrefix(globalPrefix)

  await app.listen(port, '0.0.0.0')

  logger.log(`🚀  http://0.0.0.0:${port}`, 'Bootstrap')
  if (isDev) {
    logger.log(`📖  Docs   → http://localhost:${port}/docs`, 'Bootstrap')
  }
  logger.log(`❤️  Health → http://localhost:${port}/health`, 'Bootstrap')
}

bootstrap()
