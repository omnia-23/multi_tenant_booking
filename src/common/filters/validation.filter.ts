// src/common/filters/validation.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, UnprocessableEntityException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const validationErrors = exception.getResponse() as any;

    response.status(422).json({
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: this.formatErrors(validationErrors.message),
    });
  }

  private formatErrors(errors: string[]) {
    return errors.reduce((acc, error) => {
      const [field, ...messages] = error.split(' ');
      const message = messages.join(' ');
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(message);
      return acc;
    }, {});
  }
}
