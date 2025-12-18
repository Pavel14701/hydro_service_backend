import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly requiredRole?: string) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.session?.user;

    if (!user) {
      throw new UnauthorizedException('User is not logged in');
    }

    if (this.requiredRole && user.role !== this.requiredRole) {
      throw new ForbiddenException(`Requires role ${this.requiredRole}`);
    }

    return true;
  }
}
