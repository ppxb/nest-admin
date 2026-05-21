import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { ZodError } from 'zod'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>()
    const { status, body } = this.resolve(exception)

    if (status >= 500) this.logger.error(exception)

    reply.status(status).send(body)
  }

  private resolve(exception: unknown): { status: number; body: object } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const res = exception.getResponse()

      if (status === HttpStatus.SERVICE_UNAVAILABLE) {
        return {
          status,
          body: typeof res === 'object' ? res : { message: res }
        }
      }

      return {
        status,
        body: {
          code: status,
          message: typeof res === 'string' ? res : (res as any).message,
          data: null
        }
      }
    }

    if (exception instanceof ZodError) {
      return {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        body: {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Validation failed',
          data: exception.issues
        }
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { code: 500, message: 'Internal server error', data: null }
    }
  }
}
