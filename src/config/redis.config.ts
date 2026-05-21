import { ConfigType, registerAs } from '@nestjs/config'
import { z } from 'zod'

const schema = z.object({
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().min(0).max(15).default(0)
})

export const redisConfig = registerAs('redis', () => {
  const env = schema.parse(process.env)
  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB
  }
})

export type RedisConfig = ConfigType<typeof redisConfig>
