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
import { ForgotPasswordDto, ResetPasswordDto, VerifySecretAnswerDto, VerifyUsernameDto} from './dto/resetPassword.dto';
import { RegisterDto, ActivationDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoggService } from '../common/logs/logger.service'; 
import { Usuarios } from './usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport'; 
import { RolesGuard } from '../common/guards/roles.guard'; // Guard para verificar los roles de usuario

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
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
    const { token } = await this.authService.login(loginDto, req);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
      path: '/',
    });

    this.logger.log(`Inicio de sesión exitoso para usuario ${loginDto.usuarioOEmail}`, req);

    return { status: HttpStatus.OK, message: 'Sesión iniciada exitosamente' };
  } catch (error) {
    if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
      throw error;
    }

    this.logger.error(`Error inesperado en el login de usuario ${loginDto.usuarioOEmail}: ${error.message}`, req);
    throw new UnauthorizedException('Error en la autenticación, inténtalo nuevamente.');
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
          username: decoded.username 
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
      await this.userRepository.update(userId, { sessionId: null });

      res.cookie('auth_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
      });

      this.logger.log(`Sesión cerrada para el usuario ${userId}`);
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
    return await this.authService.getSecretQuestionByUsername(VerifyUsernameDto);
  }

  @Post('reset/password/verify-secret-answer')
  async verifySecretAnswer(@Body() VerifySecretAnswerDto: VerifySecretAnswerDto) {
    return await this.authService.verifySecretAnswer(VerifySecretAnswerDto);
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
