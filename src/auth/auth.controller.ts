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
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifySecretAnswerDto,
  VerifyUsernameDto,
} from './dto/resetPassword.dto';
import { RegisterDto, ActivationDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoggService } from '../common/loggs/logger.service';
import { Usuarios } from './usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { identity } from 'rxjs';

interface AuthenticatedRequest extends Request {
  user?: { userId: string; username: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggService,
    @InjectRepository(Usuarios)
    private readonly userRepository: Repository<Usuarios>,
  ) {}

  @Post('login')
async login(
  @Body() loginDto: LoginDto,
  @Req() req: Request,
  @Res({ passthrough: true }) res: Response,
) {
  try {
    // 🔹 authService.login() debe devolver { token, usuario }
    const { token, usuario } = await this.authService.login(loginDto, req);

    // 🔹 Mantener cookie (para web)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000, // 1 hora
      path: '/',
    });

    this.logger.log(
      `Inicio de sesión exitoso para usuario ${loginDto.usuarioOEmail}`,
      req,
    );

    // 🔹 Devolver JSON con todo lo necesario para la app móvil
    return {
      success: true,
      message: 'Sesión iniciada exitosamente',
      token, // JWT
      usuario: {
        id: usuario.id,
        username: usuario.usuario || usuario.username,
        correo: usuario.correo,
        role: usuario.role || usuario.rol || 'usuario',
      },
    };
  } catch (error) {
    console.log(error)
    if (
      error instanceof UnauthorizedException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }

    this.logger.error(
      `Error inesperado en el login de usuario: ${loginDto.usuarioOEmail}: ${error.message}`,
      req,
    );
    throw new UnauthorizedException(
      'Error en la autenticación, inténtalo nuevamente.',
    );
  }
}


  @Get('validate-user')
  async validateSession(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth_token'];
    if (!token) {
      throw new UnauthorizedException('No hay token en la cookie.');
    }

    try {
      const decoded = this.jwtService.verify(token);

      // Retornar también el username
      return res.status(200).json({
        message: 'Sesión válida',
        role: decoded.role,
        username: decoded.username,
        usuario:decoded.sub,
        correo:decoded.correo,
      });
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('Usuario no autenticado');
      }

      const userId = req.user.userId;
      const username = req.user.username; // Obtenemos el nombre de usuario
      const clientIp = req.ip || 'IP no disponible'; // Extraemos la IP del cliente

      // Actualizamos el sessionId del usuario en la base de datos
      await this.userRepository.update(userId, { sessionId: null });

      // Limpiamos la cookie de autenticación
      res.cookie('auth_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
      });

      // Registramos la acción en los logs
      this.logger.log(
        `Sesión cerrada con éxito para el usuario ${username} | IP: ${clientIp}`,
      );

      return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      this.logger.error('Error al cerrar sesión:', error);
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
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

  @Post('forgot/password/')
  async forgot_password(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPasswordDto);
  }

  @Post('give/secret-question')
  async getSecretQuestion(@Body() VerifyUsernameDto: VerifyUsernameDto) {
    return await this.authService.getSecretQuestionByUsername(
      VerifyUsernameDto,
    );
  }

  @Post('reset/password/verify-secret-answer')
  async verifySecretAnswer(
    @Body() VerifySecretAnswerDto: VerifySecretAnswerDto,
  ) {
    return await this.authService.verifySecretAnswer(VerifySecretAnswerDto);
  }

  @Post('reset/password')
  async reset_password(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request, // Obtener la IP desde el request
  ) {
    return await this.authService.reset_password(resetPasswordDto, req.ip);
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
