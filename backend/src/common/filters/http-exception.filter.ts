import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception.getStatus();
    const now: string = new Date().toISOString();

    const exceptionResponse: string | Record<string, any> =
      exception.getResponse();
    if (typeof(exceptionResponse) === 'string') {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: now,
      });
    } else if (
      Object.prototype.hasOwnProperty.call(exceptionResponse, 'error') &&
      Object.prototype.hasOwnProperty.call(exceptionResponse, 'message')
    ) {
      response.status(status).json({
        statusCode: status,
        error: exceptionResponse.error,
        message: exceptionResponse.message,
        timestamp: now,
      });
    }
  }
}

