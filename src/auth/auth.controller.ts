import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  Req,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/resetPassword.dto';
import { RegisterDto, ActivationDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoggService } from '../common/logs/logger.service'; 
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggService, // 🔹 Inyectar servicio de logs


  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { token } = await this.authService.login(loginDto);

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true, // Permite que solo se envíe a través de conexiones HTTPS
        sameSite: 'none', // Permite que la cookie sea enviada en solicitudes cross-site (diferente dominio)
        maxAge: 3600000, // 1 hora en milisegundos
        path: '/', // Enviada en todas las rutas del dominio del backend
      });

      this.logger.log(
        `Inicio de sesión exitoso para usuario ${loginDto.usuario}`,
        req,
      ); // Loguear login exitoso

      return {
        status: HttpStatus.OK,
        message: 'Sesión iniciada exitosamente',
      };
    } catch (error) {
      this.logger.error(
        `Intento de inicio de sesión fallido para usuario ${loginDto.usuario}`,
        req,
      ); // Loguear intento fallido
      throw new UnauthorizedException('Credenciales incorrectas');
    }
  }

  @Get('validate-user')
  async validateSession(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth_token'];
    if (!token) {
      this.logger.warn('Intento de validación sin token en la cookie', req);
      throw new UnauthorizedException('No hay token en la cookie.');
    }

    try {
      const decoded = this.jwtService.verify(token);
      this.logger.log(`Token válido para usuario con rol: ${decoded.role}`, req);
      return res.status(200).json({ message: 'Sesión válida', role: decoded.role });
    } catch (error) {
      this.logger.error('Token inválido o expirado', req);
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0), // Expira inmediatamente
    });
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    try {
      const user = await this.authService.register(registerDto);
      this.logger.log(`Nuevo usuario registrado: ${registerDto.usuario}`, req);
      return user;
    } catch (error) {
      this.logger.error('Error en registro de usuario', req, error.stack);
      throw error;
    }
  }

  @Post('forgot/password')
  async forgot_password(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPasswordDto);
  }

  @Post('reset/password')
  async reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }

  @Post('verify/otp/code')
  async verify_email(@Body() activationDto: ActivationDto) {
    return await this.authService.verify_email(activationDto);
  }

  @Post('send-verification')
  async sendVerificationEmail(@Body('email') email: string) {
    if (!email) {
      throw new HttpException(
        'El campo "email" es obligatorio',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.authService.send_email_verification(email);
      return response;
    } catch (error) {
      throw new HttpException(
        'Error al enviar el correo de verificación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
