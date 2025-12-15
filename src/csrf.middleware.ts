import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.cookies['XSRF-TOKEN']) {
      const token = randomBytes(32).toString('hex');
      res.cookie('XSRF-TOKEN', token, { httpOnly: false, sameSite: 'Strict' });
    }
    next();
  }
}
