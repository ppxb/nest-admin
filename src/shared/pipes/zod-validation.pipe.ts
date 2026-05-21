import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import type { ZodError, ZodType } from 'zod'

export interface WithZodSchema {
  schema: ZodType
}

export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = (metadata.metatype as unknown as WithZodSchema | undefined)?.schema
    if (!schema) return value

    const result = schema.safeParse(value)
    if (!result.success) throw new BadRequestException(this.formatErrors(result.error))

    return result.data
  }

  private formatErrors(error: ZodError) {
    return {
      message: 'Validation failed',
      errors: error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }
}
