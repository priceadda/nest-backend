import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import IResponse from '../interfaces/IResponse';
// import IResponse from 'src/common/interfaces/IResponse';
@Injectable()
export class FormatResponseInterceptor<T>
    implements NestInterceptor<T, IResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<IResponse<T>> {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const res = context.switchToHttp().getResponse();
        return next.handle().pipe(
            map((response) => {
                res.status(response.statusCode || statusCode);
                return {
                    statusCode: response.statusCode || statusCode,
                    data: response.data,
                    message: response?.message || null,
                    errors: response?.errors || {},
                };
            }),
        );
    }
}
