import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilUsuarios } from './perfil_usuario.entity';

@Injectable()
export class PerfilUsuarioService {
  constructor(
    @InjectRepository(PerfilUsuarios)
    private readonly perfilRepo: Repository<PerfilUsuarios>,
  ) {}

  async create(data: Partial<PerfilUsuarios>): Promise<PerfilUsuarios> {
    const perfil = this.perfilRepo.create(data);
    return this.perfilRepo.save(perfil);
  }

  async findAll(): Promise<PerfilUsuarios[]> {
    return this.perfilRepo.find({ relations: ['usuario', 'pesos'] });
  }

  async findOne(id: string): Promise<PerfilUsuarios> {
    return this.perfilRepo.findOne({
      where: { id },
      relations: ['usuario', 'pesos'],
    });
  }

  async update(id: string, data: Partial<PerfilUsuarios>): Promise<PerfilUsuarios> {
    await this.perfilRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.perfilRepo.delete(id);
  }
}
