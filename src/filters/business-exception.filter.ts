import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CamposObrigatoriosException } from '../exceptions/luthier.exceptions';
import {
  DataFuturaException,
  BancadasInsuficientesException,
} from '../exceptions/luthier.exceptions';
import {
  DataInconsistenteException,
  CustoReparoInvalidoException,
  ReparoConcluidoSemCustoException,
} from '../exceptions/luthier.exceptions';

@Catch(
  CamposObrigatoriosException,
  DataFuturaException,
  BancadasInsuficientesException,
  DataInconsistenteException,
  CustoReparoInvalidoException,
  ReparoConcluidoSemCustoException,
)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? ((exceptionResponse as Record<string, unknown>).message as string)
        : exception.message;

    this.logger.warn(
      `Violação de regra de negócio: ${message} - ${request.method} ${request.url}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: 'Business Rule Violation',
    });
  }
}
