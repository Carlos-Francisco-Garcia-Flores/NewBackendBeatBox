// src/auth/strategies/jwt-carrito.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../../auth/usuario.entity';

@Injectable()
export class JwtCarritoStrategy extends PassportStrategy(Strategy, 'jwt-carrito') {
  constructor(
    configService: ConfigService,
    @InjectRepository(Usuarios)
    private userRepo: Repository<Usuarios>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.auth_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<Usuarios> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.sessionexpiredat && user.sessionexpiredat < new Date()) {
      throw new UnauthorizedException('Sesión expirada');
    }

    return user; // <- Retornamos la entidad completa
  }
}
