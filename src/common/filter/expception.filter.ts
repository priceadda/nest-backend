// import {
//     ArgumentsHost,
//     Catch,
//     ExceptionFilter,
//     HttpException,
//     HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { get as _get } from 'lodash';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
//     catch(exception: HttpException, host: ArgumentsHost) {
//         const context = host.switchToHttp();
//         const response = context.getResponse<Response>();
//         const statusCode = exception.getStatus();
//         const exceptionResponse = exception.getResponse();
//         let errors = {};
//         if (
//             statusCode === HttpStatus.UNPROCESSABLE_ENTITY &&
//             typeof exceptionResponse === 'object'
//         ) {
//             errors = _get(exceptionResponse, 'errors', {});
//         }
//         response.status(statusCode).json({
//             statusCode: statusCode,
//             data: null,
//             message: exception.message,
//             errors: errors,
//         });
//     }
// }

import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { get as _get } from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<FastifyReply>(); // ✅ Fastify's reply object
        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let errors = {};

        if (
            statusCode === HttpStatus.UNPROCESSABLE_ENTITY &&
            typeof exceptionResponse === 'object'
        ) {
            errors = _get(exceptionResponse, 'errors', {});
        }

        response
            .code(statusCode)
            .send({
                statusCode: statusCode,
                data: null,
                message: exception.message,
                errors: errors,
            });
    }
}

