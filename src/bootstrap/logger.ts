import { RequestMethod } from '@nestjs/common'
import type { Params } from 'nestjs-pino'

export function createLoggerOptions(logLevel: string, isDev: boolean): Params {
  return {
    forRoutes: [{ method: RequestMethod.ALL, path: '*wildcard' }],
    pinoHttp: {
      level: logLevel,
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              messageFormat: '[{context}] {msg}',
              ignore: 'hostname,context,req,res,pid,responseTime'
            }
          }
        : undefined,
      customProps: () => ({ context: 'HTTP' }),
      customSuccessMessage: (req, res, responseTime) =>
        `✨ ${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms)`,
      customErrorMessage: req => `❌ ${req.method} ${req.url} failed`
    }
  }
}
