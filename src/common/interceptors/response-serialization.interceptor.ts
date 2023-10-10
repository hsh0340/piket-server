import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 컨트롤러로부터 받은 응답 데이터를 가로채고 조작합니다.
    return next.handle().pipe(
      map((data) => {
        return {
          isSuccess: true,
          code: '1000',
          message: '요청에 성공하였습니다.',
          result: data, // 데이터를 result 프로퍼티에 넣음
        };
      }),
    );
  }
}
