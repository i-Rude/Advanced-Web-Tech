import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { jwtConstants } from './auth.constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private adminService : AdminService,
        private jwtService : JwtService,

    ){}
async signIn(email: string, password: string) {
  const admin = await this.adminService.findByEmail(email);
  if (!admin) throw new UnauthorizedException();
  
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new UnauthorizedException();

  
  const payload = {
    sub: admin.id,       
    email: admin.email, 
    role: 'admin' 
  };

  return {
    access_token: await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h'
    })
  };
}
  async decodeToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, { secret: jwtConstants.secret });
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }
}
