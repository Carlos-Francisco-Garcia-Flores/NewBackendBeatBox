import { Injectable } from '@nestjs/common';
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
    const peso = this.pesoRepo.create(data);
    return this.pesoRepo.save(peso);
  }

  async findAll(): Promise<PesoM[]> {
    return this.pesoRepo.find({ relations: ['perfil'] });
  }

  async findByPerfil(idperfil: string): Promise<PesoM[]> {
  return this.pesoRepo.find({
    where: { perfilUsuario: { id: idperfil } },
    relations: ['perfilUsuario'], 
    order: { fecha: 'DESC' },
  });
}

  async remove(id: string): Promise<void> {
    await this.pesoRepo.delete(id);
  }
}
