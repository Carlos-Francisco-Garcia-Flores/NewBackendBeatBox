import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Ejemplo usando Gmail
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const url = `https://proyecto-7mo-git-master-carlos-projects-0daf7c1f.vercel.app/reset_password?token=${resetToken}`;
    await this.transporter.sendMail({
      to,
      subject: '🔒 Solicitud de restablecimiento de Contraseña 🤔❓',
      html: `
        <p>Hola, estimado usuario.</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizó esta solicitud, ignore este mensaje.</p>
        <p>Para poder restablecer su contraseña, haga clic en el enlace:</p>
        <a href="${url}" style="color: #4CAF50;">Restablecer</a>
        <p>Este enlace es válido por 30 minutos.</p>
        <p>Atentamente,</p>
        <p><strong>BeatBox fitness room</strong></p>
      `,
    });
  }

  // Enviar codigo de verificacion para activar cuenta
  async send_code_verfication(otpCode: string, email: string) {
    await this.transporter.sendMail({
      to: email,
      subject: '✅ Verificación de Cuenta ',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2>¡Bienvenido a <strong>BeatBox</strong>!</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
            <p>Estimado usuario,</p>
            <p style="font-size: 16px;">¡Gracias por registrarse en <strong>Beatbox</strong>! Para completar su registro, necesitamos que verifique su dirección de correo electrónico.</p>
            <p style="text-align: center;">
              <span style="
                display: inline-block;
                background-color: #ff8800;
                color: white;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease, transform 0.3s ease;
              ">
                ${otpCode}
              </span>
            </p>
            <p style="font-size: 14px;">Si no realizó esta solicitud, puede ignorar este mensaje.</p>
            <p>Atentamente,</p>
            <p><strong>BeatBox</strong></p>
          </div>
        </div>
      `,
    });
  }
}