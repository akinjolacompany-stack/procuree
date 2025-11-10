import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContext } from '../context/requestContext';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    let result: Observable<any>;
    RequestContext.run({ userId: user?.id, groupId: user?.groupId }, () => {
      result = next.handle();
    });
    return result!;
  }
}
