import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilEmpresa } from './perfil_empresa.entity';
import { Logos } from '../logos/logos.entity';
import { UpdatePerfilEmpresaDto } from './update-perfil_empresa.dto';

@Injectable()
export class PerfilEmpresaService {
  constructor(
    @InjectRepository(PerfilEmpresa)
    private perfilEmpresaRepository: Repository<PerfilEmpresa>,
    @InjectRepository(Logos)
    private logosRepository: Repository<Logos>,
  ) {}

  async obtenerPerfil(): Promise<PerfilEmpresa> {
    const perfil = await this.perfilEmpresaRepository.findOne({ where: {} });
    if (!perfil) {
      throw new NotFoundException('Perfil de la empresa no encontrado');
    }
    return perfil;
  }

  async actualizarCampo(campo: string, dto: any): Promise<PerfilEmpresa> {
    if (!['mision', 'vision', 'idlogo'].includes(campo)) {
      throw new BadRequestException(`El campo ${campo} no es válido`);
    }

    let perfil = await this.perfilEmpresaRepository.findOne({ where: {} });

    if (!perfil) {
      perfil = this.perfilEmpresaRepository.create();
    }

    if (campo === 'idlogo') {
      // Si el campo es idlogo, buscamos el logo por su ID
      const logoId = dto.idlogo ? Number(dto.idlogo) : null;
      if (logoId) {
        const logo = await this.logosRepository.findOne({
          where: { id: logoId },
        });
        if (!logo) {
          throw new BadRequestException('El logo con este ID no existe');
        }
        perfil.idlogo = logo;
      }
    } else if (dto[campo] !== undefined) {
      // Para otros campos, extraemos el valor específico del DTO
      perfil[campo] = dto[campo];
    } else {
      throw new BadRequestException(
        `El valor para el campo ${campo} no está definido en el DTO`,
      );
    }

    return this.perfilEmpresaRepository.save(perfil);
  }
}
