import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  status: boolean;
  message: string;
  data: T;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;
        const status = statusCode >= 200 && statusCode < 300;

        let message = 'Request successful';
        const handler = context.getHandler();
        const dynamicMessage = Reflect.getMetadata('message', handler);

        if (dynamicMessage) {
          message = dynamicMessage;
        }

        return {
          status,
          message,
          data,
          statusCode,
        };
      }),
    );
  }
}
