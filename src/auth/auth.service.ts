import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './usuario.entity'; // Entidad de usuario en TypeORM
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/resetPassword.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, ActivationDto } from './dto/register.dto';
import { EmailService } from '../services/email.service';
import { OtpService } from '../services/otp.service';
import { PwnedService } from '../services/pwned.service';
import { ZxcvbnService } from '../services/zxcvbn.service';
import { IncidentService } from '../incident/incident.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private generateSessionID(): string {
    return randomBytes(32).toString('hex');
  }

  constructor(
    @InjectRepository(Usuarios) private userRepository: Repository<Usuarios>,
    private jwtService: JwtService,
    private incidentService: IncidentService,
    private emailService: EmailService,
    private pwnedservice: PwnedService,
    private zxcvbnService: ZxcvbnService,
    private otpService: OtpService,
  ) {}

  // Registro de usuario, hasheo de contraseña
  async register(registerDto: RegisterDto): Promise<any> {
    const { sessionId, usuario, password, correo_electronico } = registerDto;

    // Verificar si el correo ya está registrado
    const existingEmail = await this.userRepository.findOne({
      where: { correo_electronico },
    });
    if (existingEmail) {
      throw new BadRequestException({
        message: `El correo electrónico '${correo_electronico}' ya está registrado.`,
        error: 'Conflict',
      });
    }

    // Verificar si el nombre de usuario ya está registrado
    const existingUser = await this.userRepository.findOne({
      where: { usuario },
    });
    if (existingUser) {
      throw new BadRequestException({
        message: `El nombre de usuario '${usuario}' ya está en uso.`,
        error: 'Conflict',
      });
    }

    // Verificar la contraseña con zxcvbn
    const zxcvbnResult = this.zxcvbnService.validatePassword(password);
    if (zxcvbnResult) {
      throw new BadRequestException({
        message: 'La contraseña ingresada es débil',
        error: 'BadRequest',
      });
    }

    // Verificar si la contraseña fue comprometida
    const timesCommitted =
      await this.pwnedservice.verificationPassword(password);
    if (timesCommitted > 0) {
      throw new BadRequestException({
        message: `La contraseña ya fue comprometida ${timesCommitted} veces`,
        error: 'BadRequest',
      });
    }

    // Hasheo de la contraseña utilizado bcrypt con 10  rondas de procesamiento 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = this.userRepository.create({
      sessionId: sessionId,
      usuario,
      password: hashedPassword,
      correo_electronico,
    });

    // Enviar correo de verificación
    await this.send_email_verification(correo_electronico);

    // Guardar el nuevo usuario en la base de datos
    await this.userRepository.save(newUser);

    return {
      status: HttpStatus.OK,
      message:
        'Gracias por registrarse, hemos enviado un link de activación de cuenta a su correo',
    };
  }

  // Login de usuario
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { usuario, password } = loginDto;

    const sessionId = this.generateSessionID();
    const user = await this.userRepository.findOne({ where: { usuario } });

    if (!user) {
      throw new ConflictException(
        `Credenciales de inicio de sesión no coiciden o no existen`,
      );
    }

    // Verificar si la cuenta está bloqueada manualmente por un administrador
    if (user.bloqueado) {
      throw new ForbiddenException(
        'Su cuenta ha sido bloqueada por los administradores. En caso de ser necesario comuníquese con soporte técnico.',
      );
    }

    if (!user.estado) {
      throw new ForbiddenException(
        'Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios.',
      );
    }

    // Verificar si el usuario ha sido bloqueado debido a incidentes
    const userIncident = await this.incidentService.usernameIsBlocked({
      idusuario: user.id,
    });
    if (userIncident && userIncident.isblocked) {
      const bloqueExpiresAtMexico = new Date(
        userIncident.blockexpiresat,
      ).toLocaleString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      throw new ForbiddenException(
        `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${bloqueExpiresAtMexico}.`,
      );
    }

    // Verificar la contraseña
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      await this.incidentService.loginFailedAttempt(user.id);
      throw new ConflictException(
        'Acceso denegado: Las credenciales son incorrectas',
      );
    }

    // Generar nuevo sessionId y guardar el usuario
    user.sessionId = sessionId;
    await this.userRepository.save(user);

    // Generar JWT
    const payload = { username: user.usuario, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  // Olvidar Contraseña
  async forgot_password(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { correo_electronico } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { correo_electronico },
    });

    if (!user) {
      throw new BadRequestException('El correo no está registrado');
    }

    const resetToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '1h' },
    );
    await this.emailService.sendPasswordResetEmail(
      correo_electronico,
      resetToken,
    );

    return { message: 'Se ha enviado un correo con el enlace de recuperación' };
  }

  // Restablecer Contraseña
  async reset_password(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, new_password } = resetPasswordDto;

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new BadRequestException('Token inválido o expirado');
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);
      await this.revokeSessions(user.id);

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (err) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  // Enviar correo de verificación por OTP
  async send_email_verification(email: string): Promise<any> {
    const otpCode = this.otpService.generateOTP();
    await this.emailService.send_code_verfication(otpCode, email);

    return {
      status: HttpStatus.OK,
      message: 'Se ha enviado a su correo un link de activación',
    };
  }

  // Verificación de Email
  async verify_email(activationDto: ActivationDto): Promise<any> {
    const { correo_electronico, otp } = activationDto;

    const isValid = this.otpService.verifyOTP(otp);
    if (isValid) {
      const user = await this.userRepository.findOne({
        where: { correo_electronico },
      });

      if (!user) {
        throw new BadRequestException('El correo no está registrado');
      }

      user.estado = true;
      await this.userRepository.save(user);

      return {
        status: HttpStatus.OK,
        message: 'Se ha verificado con éxito la cuenta',
      };
    }

    throw new ConflictException({
      message: 'El código es inválido',
      error: 'Conflict',
    });
  }

  // Revocación de cookies (sesiones)
  private async revokeSessions(userId: string): Promise<any> {
    await this.userRepository.update(userId, { sessionId: null });
    return { message: 'Todas las sesiones han sido revocadas.' };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Sesión cerrada exitosamente' };
  }

  async validateSessionjwt(req: Request): Promise<any> {
    const token = req.cookies['auth_token'];

    if (!token) {
      throw new UnauthorizedException('No hay token en la cookie.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
