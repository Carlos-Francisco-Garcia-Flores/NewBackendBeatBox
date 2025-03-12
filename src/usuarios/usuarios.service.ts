import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Para inyectar repositorio
import { Repository } from 'typeorm';
import { Usuario } from './usuarios.entity.js'; // Importa la entidad Usuario

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>, // Usar el repositorio de TypeORM
  ) {}

  async toggleBloqueo(id: string, bloquear: boolean): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    usuario.bloqueado = bloquear;
    return this.usuarioRepository.save(usuario); // Guardar cambios
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find(); // Obtener todos los usuarios
  }

  async findOne(id: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({ where: { id } }); // Obtener un usuario por ID
  }

  async findByEmail(correo_electronico: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { correo_electronico } }); // Buscar por correo electrónico
  }

  async findByUser(usuario: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { usuario } }); // Buscar por nombre de usuario
  }

  async update(id: string, updateUsuarioDto: any): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    Object.assign(usuario, updateUsuarioDto); // Actualiza las propiedades del usuario con los del DTO
    return this.usuarioRepository.save(usuario); // Guardar cambios
  }

  async delete(id: number): Promise<any> {
    return this.usuarioRepository.delete(id); // Eliminar usuario
  }
}
