import { NestFastifyApplication } from '@nestjs/platform-fastify'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import cookie from '@fastify/cookie'
import { ConfigService } from '@nestjs/config'

import { AppConfig } from '~/config/app.config'

export async function setupFastify(app: NestFastifyApplication) {
  await app.register(helmet)
  await app.register(multipart)
  await app.register(cookie)

  const config = app.get(ConfigService)
  const { corsOrigin } = config.get<AppConfig>('app')!

  app.enableCors({ origin: corsOrigin, credentials: true })
}
