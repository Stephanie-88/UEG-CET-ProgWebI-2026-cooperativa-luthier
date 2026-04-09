import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LuthierNotFoundException } from '../../modules/luthier/domain/luthier.exceptions';
import { InstrumentoReparoNotFoundException, LuthierNaoEncontradoParaInstrumentoException } from '../../modules/instrumento-reparo/domain/instrumento-reparo.exceptions';

export interface ErrorDetail {
    field?: string;
    code: string;
    description: string;
}

export interface ErrorResponse {
    status: number;
    message: string;
    error: string;
    detail: ErrorDetail[];
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const errorResponse = this.resolveException(exception);

        this.logger.error(
            `${request.method} ${request.url} → ${errorResponse.status}`,
            exception instanceof Error ? exception.stack : String(exception),
        );

        response.status(errorResponse.status).json(errorResponse);
    }

    // -------------------------------------------------------------------------
    // Handlers por tipo de exceção
    // -------------------------------------------------------------------------

    private handleLuthierNotFound(ex: LuthierNotFoundException): ErrorResponse {
        return {
            status: HttpStatus.NOT_FOUND,
            message: 'Recurso não encontrado',
            error: 'LUTHIER_NOT_FOUND',
            detail: [{ field: 'id', code: 'LUTHIER_NOT_FOUND', description: ex.message }],
        };
    }

    private handleInstrumentoNotFound(ex: InstrumentoReparoNotFoundException): ErrorResponse {
        return {
            status: HttpStatus.NOT_FOUND,
            message: 'Recurso não encontrado',
            error: 'INSTRUMENTO_REPARO_NOT_FOUND',
            detail: [{ field: 'id', code: 'INSTRUMENTO_REPARO_NOT_FOUND', description: ex.message }],
        };
    }

    private handleLuthierNaoEncontradoParaInstrumento(ex: LuthierNaoEncontradoParaInstrumentoException): ErrorResponse {
        return {
            status: HttpStatus.NOT_FOUND,
            message: 'Recurso não encontrado',
            error: 'LUTHIER_NOT_FOUND_FOR_INSTRUMENTO',
            detail: [{ field: 'luthierId', code: 'LUTHIER_NOT_FOUND_FOR_INSTRUMENTO', description: ex.message }],
        };
    }

    private handleHttpException(ex: HttpException): ErrorResponse {
        const status = ex.getStatus();
        const body = ex.getResponse();
        const message = typeof body === 'object' && body !== null
            ? ((body as Record<string, unknown>).message as string) || ex.message
            : ex.message;
        const error = typeof body === 'object' && body !== null
            ? ((body as Record<string, unknown>).error as string) || ex.name
            : ex.name;

        // Flatten validation errors array if present
        const rawMessage = typeof body === 'object' && body !== null
            ? (body as Record<string, unknown>).message
            : null;
        const detail: ErrorDetail[] = Array.isArray(rawMessage)
            ? rawMessage.map((m: string) => ({ code: error, description: m }))
            : [{ code: error, description: message }];

        return { status, message: Array.isArray(rawMessage) ? 'Dados inválidos' : message, error, detail };
    }

    private handleUnknown(exception: unknown): ErrorResponse {
        const message = exception instanceof Error ? exception.message : 'Erro interno do servidor';
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Erro interno do servidor',
            error: 'INTERNAL_SERVER_ERROR',
            detail: [{ code: 'INTERNAL_SERVER_ERROR', description: message }],
        };
    }

    // -------------------------------------------------------------------------
    // Roteador central
    // -------------------------------------------------------------------------

    private resolveException(exception: unknown): ErrorResponse {
        if (exception instanceof LuthierNotFoundException) return this.handleLuthierNotFound(exception);
        if (exception instanceof InstrumentoReparoNotFoundException) return this.handleInstrumentoNotFound(exception);
        if (exception instanceof LuthierNaoEncontradoParaInstrumentoException) return this.handleLuthierNaoEncontradoParaInstrumento(exception);
        if (exception instanceof HttpException) return this.handleHttpException(exception);
        return this.handleUnknown(exception);
    }
}
