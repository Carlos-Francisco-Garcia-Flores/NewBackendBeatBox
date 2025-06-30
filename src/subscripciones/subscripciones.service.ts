import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscripcion } from './subscripciones.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class SubscripcionesService {
  constructor(
    @InjectRepository(Subscripcion)
    private readonly subsRepo: Repository<Subscripcion>,
  ) {}

    @Cron('0 0 * * *') // todos los días a las 00:00
      async reducirTiempoActiva() {
        const subs = await this.subsRepo.find();

        for (const sub of subs) {
          if (sub.tiempo_activa > 0) {
            sub.tiempo_activa -= 1;
            await this.subsRepo.save(sub);
          }
          if(sub.tiempo_activa == 0 ){
            sub.estado = false;
            await this.subsRepo.save(sub);

          }
        }
      }


    async crear(data: Partial<Subscripcion>): Promise<Subscripcion> {
    const usuarioId = typeof data.usuario === 'string' ? data.usuario : data.usuario?.id;
    if (!usuarioId) throw new Error('Usuario no especificado');

    // Generar código único por usuario
    let codigoGenerado: string;
    let codigoExiste = true;

    do {
      codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();
      const repetida = await this.subsRepo.findOne({
        where: {
          usuario: { id: usuarioId },
          codigo: codigoGenerado,
        },
        relations: ['usuario'],
      });
      codigoExiste = !!repetida;
    } while (codigoExiste);

    // Armar entidad correctamente
    const subscripcion = this.subsRepo.create({
      ...data,
      codigo: codigoGenerado,
      usuario: { id: usuarioId } as Usuario, // 👈 esto es lo clave
    });

    return this.subsRepo.save(subscripcion);
  }

  async obtenerTodas(): Promise<Subscripcion[]> {
    return this.subsRepo.find({ relations: ['usuario'] });
  }

  async obtenerPorCodigo(codigo: string): Promise<any> {
  const sub = await this.subsRepo.findOne({
    where: { codigo },
    relations: ['usuario'],
  });

    if (!sub) {
      throw new NotFoundException(`No se encontró una subscripción con código: ${codigo}`);
    }

    return {
      estado: sub.estado,
      tiempo_activa: sub.tiempo_activa,
      codigo: sub.codigo,
      usuario: {
        id: sub.usuario.id,
        usuario: sub.usuario.usuario,
      },
    };
  }


  async eliminar(id: string): Promise<void> {
    await this.subsRepo.delete(id);
  }
}
