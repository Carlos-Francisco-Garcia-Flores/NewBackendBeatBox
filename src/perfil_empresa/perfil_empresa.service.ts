import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilEmpresa } from './perfil_empresa.entity';
import { UpdatePerfilEmpresaDto } from './dto/update-perfil_empresa.dto';

@Injectable()
export class PerfilEmpresaService {
  constructor(
    @InjectRepository(PerfilEmpresa)
    private perfilEmpresaRepository: Repository<PerfilEmpresa>,
  ) {}

  async obtenerPerfil(): Promise<PerfilEmpresa> {
    const perfil = await this.perfilEmpresaRepository.findOne({ where: {} });
    if (!perfil) {
      throw new NotFoundException('Perfil de la empresa no encontrado');
    }
    return perfil;
  }

  async actualizarCampo(campo: string, valor: string): Promise<PerfilEmpresa> {
    if (!['eslogan', 'mision', 'vision', 'logo'].includes(campo)) {
      throw new BadRequestException(`El campo ${campo} no es válido`);
    }

    let perfil = await this.perfilEmpresaRepository.findOne({ where: {} });

    if (!perfil) {
      perfil = this.perfilEmpresaRepository.create({ [campo]: valor });
    } else {
      (perfil as any)[campo] = valor;
    }

    return this.perfilEmpresaRepository.save(perfil);
  }
}
