import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PesoM } from './peso-m.entity';

@Injectable()
export class PesoMService {
  constructor(
    @InjectRepository(PesoM)
    private readonly pesoRepo: Repository<PesoM>,
  ) {}

  async create(data: Partial<PesoM>): Promise<PesoM> {
    if (!data.idperfil) {
      throw new BadRequestException('Falta el ID del perfil');
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Buscar el último registro del perfil
    const lastPeso = await this.pesoRepo.findOne({
      where: { idperfil: data.idperfil },
      order: { fecha: 'DESC' },
    });

    // Verificar si el nuevo registro es mensual
    let esMensual = false;
    if (
      !lastPeso ||
      new Date(lastPeso.fecha).getMonth() !== currentMonth ||
      new Date(lastPeso.fecha).getFullYear() !== currentYear
    ) {
      esMensual = true;
    }

    const nuevoPeso = this.pesoRepo.create({
      ...data,
      fecha: today,
      es_mensual: esMensual,
    });

    return this.pesoRepo.save(nuevoPeso);
  }

  async findAll(): Promise<PesoM[]> {
    return this.pesoRepo.find({ order: { fecha: 'DESC' } });
  }

  async findByPerfil(idperfil: string): Promise<PesoM[]> {
    return this.pesoRepo.find({
      where: { idperfil },
      order: { fecha: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.pesoRepo.delete(id);
  }
}
