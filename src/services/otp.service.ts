import * as speakeasy from 'speakeasy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(private readonly configService: ConfigService) {}

  generateOTP() {
    const secret = this.configService.get<string>('OTP_KEY');
    const step = this.configService.get<number>('OTP_STEP', 300);

    if (!secret) {
      console.error('OTP_KEY no está definido en las variables de entorno'); // Log de error si no hay clave
      throw new Error('OTP_KEY no está definido');
    }

    console.log('Generando OTP con secret:', secret); // Log del valor de secret

    return speakeasy.totp({
      secret,
      encoding: 'base32',
      step,
    });
  }

  verifyOTP(token: string) {
    const secret = this.configService.get<string>('OTP_KEY');
    const step = this.configService.get<number>('OTP_STEP', 300);

    if (!secret) {
      console.error('OTP_KEY no está definido en las variables de entorno'); // Log de error si no hay clave
      throw new Error('OTP_KEY no está definido');
    }

    console.log('Verificando OTP con secret:', secret); // Log para la verificación

    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      step,
      window: 1, // Permitir una pequeña tolerancia de tiempo
    });
  }
}
