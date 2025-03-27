import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Request } from 'express';

@Injectable()
export class LoggService implements LoggerService {
  private logDirectory: string;

  constructor() {
    // Directorio donde se almacenarán los logs
    this.logDirectory = path.join(__dirname, '../../../logs');
    // Asegurarse de que el directorio de logs exista
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory);
    }
  }

  private getFormattedTimestamp(): string {
    return new Date().toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City', // Forzando la zona horaria de Ciudad de México
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private getLogFilePath(): string {
    // Generar el nombre del archivo con la fecha actual
    const today = new Date();
    const fileName = `app-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.log`;
    return path.join(this.logDirectory, fileName);
  }

  private writeToFile(level: string, message: string, ip?: string, trace?: string) {
    const timestamp = this.getFormattedTimestamp(); // Obtener hora en México
    const logMessage = `[${timestamp}] [${level}] ${message} ${ip ? `| IP: ${ip}` : ''} ${trace ? `\nTRACE: ${trace}` : ''}\n`;

    const logFilePath = this.getLogFilePath(); // Obtener la ruta del archivo log con fecha
    fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' }); // Guardar en archivo
  }

  private getClientIp(req?: Request): string {
    return req?.headers['x-forwarded-for'] as string || req?.socket.remoteAddress || 'IP no disponible';
  }

  log(message: string, req?: Request) {
    console.log(`📘 LOG: ${message}`);
    this.writeToFile('LOG', message, req ? this.getClientIp(req) : undefined);
  }

  error(message: string, req?: Request, trace?: string) {
    console.error(`🚨 ERROR: ${message}`);
    this.writeToFile('ERROR', message, req ? this.getClientIp(req) : undefined, trace);
  }

  warn(message: string, req?: Request) {
    console.warn(`⚠️ WARN: ${message}`);
    this.writeToFile('WARN', message, req ? this.getClientIp(req) : undefined);
  }

  debug(message: string, req?: Request) {
    console.debug(`🐛 DEBUG: ${message}`);
    this.writeToFile('DEBUG', message, req ? this.getClientIp(req) : undefined);
  }

  verbose(message: string, req?: Request) {
    console.log(`🔍 VERBOSE: ${message}`);
    this.writeToFile('VERBOSE', message, req ? this.getClientIp(req) : undefined);
  }
}
