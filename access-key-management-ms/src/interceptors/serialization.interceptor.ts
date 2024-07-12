// serialize.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Serializable {
  toJSON(): any;
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map(item => this.serialize(item));
        } else {
          return this.serialize(data);
        }
      }),
    );
  }

  private serialize(data: any): any {
    if (this.isSerializable(data)) {
      return data.toJSON();
    } else {
      return data;
    }
  }

  private isSerializable(data: any): data is Serializable {
    return data && typeof data.toJSON === 'function';
  }
}
