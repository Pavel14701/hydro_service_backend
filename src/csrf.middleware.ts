import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.cookies['XSRF-TOKEN']) {
      const token = randomBytes(32).toString('hex');
      res.cookie('XSRF-TOKEN', token, { httpOnly: false, sameSite: 'Strict' });
    }
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const tokenFromCookie = req.cookies['XSRF-TOKEN'];
      const tokenFromHeader = req.headers['x-xsrf-token'];
      if (!tokenFromHeader || tokenFromHeader !== tokenFromCookie) {
        throw new ForbiddenException('Invalid CSRF token');
      }
    }
    next();
  }
}
