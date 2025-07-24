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
    const url = `https://khaki-termite-457506.hostingersite.com/cambiar_contraseña?token=${resetToken}`;
    await this.transporter.sendMail({
      to,
      subject: '🔒 Solicitud de restablecimiento de Contraseña 🤔❓',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2>Restablecer Contraseña</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
            <p style="font-size: 16px;">Hola, estimado usuario.</p>
            <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
            <p style="font-size: 16px;">Para restablecer tu contraseña, por favor haz clic en el siguiente enlace:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${url}" style="
                display: inline-block;
                background-color: #4CAF50; /* Botón verde */
                color: white;
                padding: 15px 30px;
                border-radius: 5px;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
              ">
                Restablecer Contraseña
              </a>
            </p>
            <p style="font-size: 14px; color: #777;">Este enlace es válido por 30 minutos.</p>
            <p style="font-size: 16px;">Atentamente,</p>
            <p><strong>BeatBox Fitness Room</strong></p>
          </div>
        </div>

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
          <p style="font-size: 16px;">¡Gracias por registrarse en <strong>BeatBox</strong>! Para completar su registro, necesitamos que verifique su dirección de correo electrónico.</p>
          <p style="text-align: center;">
            <span style="
              display: inline-block;
              background-color: #ff8800; /* Cambiado a naranja */
              color: white;
              padding: 15px 30px;
              border-radius: 25px;
              font-size: 20px;
              font-weight: bold;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
              transition: background-color 0.3s ease, transform 0.3s ease;
              cursor: pointer;
            ">
              ${otpCode}
            </span>
          </p>
          <p style="font-size: 14px;">El código solo sera valido por 15 minutos.</p>
          <p style="font-size: 14px;">Si no realizó esta solicitud, puede ignorar este mensaje.</p>
          <p>Atentamente,</p>
          <p><strong>BeatBox</strong></p>
        </div>
      </div>
      `,
    });
  }
}
