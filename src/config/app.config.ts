import { registerAs } from '@nestjs/config'
import { z } from 'zod'

const schema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  GLOBAL_PREFIX: z.string().default('api'),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGIN: z.string().default('*')
})

export const appConfig = registerAs('app', () => {
  const env = schema.parse(process.env)
  return {
    port: env.PORT,
    globalPrefix: env.GLOBAL_PREFIX,
    mode: env.MODE,
    logLevel: env.LOG_LEVEL,
    corsOrigin: env.CORS_ORIGIN,
    isDev: env.MODE === 'development',
    isProd: env.MODE === 'production',
    isTest: env.MODE === 'test'
  }
})

export type AppConfig = ReturnType<typeof appConfig>
