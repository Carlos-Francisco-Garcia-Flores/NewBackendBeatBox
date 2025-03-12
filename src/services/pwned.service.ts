import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PwnedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async verificationPassword(contraseña: string): Promise<any> {
    const hash = this.sha1(contraseña); // Generamos el hash SHA-1 de la contraseña
    const prefix = hash.substring(0, 5); // Tomamos los primeros 5 caracteres como prefijo
    const suffix = hash.substring(5).toUpperCase(); // El resto es el sufijo
    const API_PWNED = this.configService.get<string>('API_PWNED'); // Obtenemos la URL de la API de la configuración

    console.log('Hash generado:', hash); // Log del hash
    console.log('Prefijo:', prefix, 'Sufijo:', suffix); // Log del prefijo y sufijo
    console.log('API PWNED URL:', API_PWNED); // Verificamos la URL de la API

    try {
      // Llamada a la API de Have I Been Pwned con el prefijo del hash
      console.log(`Llamando a la API de Pwned: ${API_PWNED}/${prefix}`); // Log antes de la llamada
      const response = await firstValueFrom(
        this.httpService.get(`${API_PWNED}/${prefix}`),
      );
      console.log('Respuesta de la API:', response.data); // Log de la respuesta de la API

      // Procesamos los datos devueltos por la API para encontrar coincidencias con el sufijo
      const hashes = response.data.split('\n');
      for (const line of hashes) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          console.log(`Contraseña comprometida ${count} veces`); // Log del número de veces que la contraseña fue comprometida
          return parseInt(count, 10); // Devolver el número de veces
        }
      }

      return 0; // Si no encontramos coincidencias, la contraseña no fue comprometida
    } catch (err) {
      console.error('Error en la llamada a la API de Pwned:', err); // Log del error
      throw new HttpException(
        'Error al verificar la contraseña',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Método privado para generar el hash SHA-1 de la contraseña
  private sha1(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha1').update(str).digest('hex').toUpperCase();
  }
}
