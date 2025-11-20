import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilUsuarios } from './perfil_usuario.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdatePerfilUsuarioDto } from './update-perfil-usuario.dto';

@Injectable()
export class PerfilUsuarioService {
  constructor(
    @InjectRepository(PerfilUsuarios)
    private readonly perfilRepo: Repository<PerfilUsuarios>,
  ) {}

  async create(data: Partial<PerfilUsuarios>): Promise<PerfilUsuarios> {
  if (data['idusuario']) {
    data.usuario = { id: data['idusuario'] } as any; // vincula relación
    delete data['idusuario'];
  }

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

async findByUsuarioId(idusuario: string): Promise<PerfilUsuarios> {
  try {
    console.log('🧠 ID recibido:', idusuario);

    const perfil = await this.perfilRepo.findOne({
      where: { usuario: { id: idusuario } },
      relations: ['usuario', 'pesos'],
    });

    console.log('🧩 Perfil encontrado:', perfil);

    if (!perfil) {
      console.warn('⚠️ No se encontró un perfil con ese usuario');
      throw new Error('Perfil no encontrado');
    }

    return perfil;
  } catch (error) {
    console.error('❌ Error en findByUsuarioId:', error);
    throw new Error('Error al obtener el perfil del usuario');
  }
}


  async update(id: string, data: Partial<PerfilUsuarios>): Promise<PerfilUsuarios> {
    await this.perfilRepo.update(id, data);
    return this.findOne(id);
  }

    async updateByUsuarioId(
    idusuario: string,
    data: UpdatePerfilUsuarioDto,
  ): Promise<PerfilUsuarios> {
    const perfilExistente = await this.perfilRepo.findOne({
      where: { usuario: { id: idusuario } },
    });

    if (perfilExistente) {
      // Actualizar perfil existente
      this.perfilRepo.merge(perfilExistente, data);
      return this.perfilRepo.save(perfilExistente);
    } else {
      // Crear nuevo perfil
      const nuevoPerfil = this.perfilRepo.create({
        ...data,
        usuario: { id: idusuario },
      });
      return this.perfilRepo.save(nuevoPerfil);
    }
}



  async remove(id: string): Promise<void> {
    await this.perfilRepo.delete(id);
  }
}
