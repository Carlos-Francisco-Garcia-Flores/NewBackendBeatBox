import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Para inyectar repositorio
import { Repository } from 'typeorm';
import { Usuario } from './usuarios.entity.js'; // Importa la entidad Usuario
import { LoggService } from '../common/loggs/logger.service.js'; 

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) 
    private usuarioRepository: Repository<Usuario>, 
    private readonly loggService: LoggService, 

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


  async updateRole(id: string, newRole: string, req: any): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const oldRole = usuario.role; // Guardamos el rol anterior
    usuario.role = newRole;

    await this.usuarioRepository.save(usuario);

    // Registrao del cambio en el log con IP del usuario que realiza la acción
    this.loggService.log(
      `Cambio de rol: Usuario ${usuario.usuario} (ID: ${id}) de '${oldRole}' a '${newRole}'`,
      req,
    );

    return usuario;
  }
}
