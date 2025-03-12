import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si no hay roles requeridos, permitir acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      console.error('Acceso denegado. Usuario no autenticado o sin rol asignado.');
      throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
    }

    // Convertir `user.role` a un array si no lo es y verificar si tiene al menos un rol permitido
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      console.error(`Acceso denegado. Roles requeridos: ${requiredRoles}, Roles del usuario: ${userRoles}`);
      throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
    }

    console.log('Acceso permitido. Rol válido:', userRoles);
    return true;
  }
}
