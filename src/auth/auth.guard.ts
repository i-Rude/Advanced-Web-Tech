import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './auth.constants';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        { secret: jwtConstants.secret }
      );
      
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };

      
      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) || [];
      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        throw new UnauthorizedException('Insufficient permissions');
      }

    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}