import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedSocial } from './red-social.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(RedSocial) private redSocialRepository: Repository<RedSocial>, // Usar el repositorio de TypeORM
  ) {}

  // Crear o actualizar una red social
  async createOrUpdate(tipo: string, linkRed: string): Promise<RedSocial> {
    let redSocial = await this.redSocialRepository.findOne({ where: { tipo } });
    if (redSocial) {
      redSocial.linkRed = linkRed;
      return this.redSocialRepository.save(redSocial); // Actualiza la red social
    }
    // Crear una nueva red social
    redSocial = this.redSocialRepository.create({ tipo, linkRed });
    return this.redSocialRepository.save(redSocial); // Guarda la nueva red social
  }

  // Obtener todas las redes sociales
  async findAll(): Promise<RedSocial[]> {
    return this.redSocialRepository.find(); // Obtener todas las redes sociales
  }

  // Obtener una red social por tipo
  async findOne(tipo: string): Promise<RedSocial> {
    const redSocial = await this.redSocialRepository.findOne({ where: { tipo } });
    if (!redSocial) throw new NotFoundException(`Red social tipo ${tipo} no encontrada`);
    return redSocial;
  }

  // Eliminar una red social por tipo
  async remove(tipo: string): Promise<void> {
    const result = await this.redSocialRepository.delete({ tipo });
    if (result.affected === 0) {
      throw new NotFoundException(`Red social tipo ${tipo} no encontrada`);
    }
  }
}
