import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LoggService } from '../common/loggs/logger.service';
import { Request } from 'express';

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly loggService: LoggService, // Inyectamos LoggService
  ) {}
  @Get()
  async getAll() {
    return await this.productosService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productosService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateProductoDto, @Req() req: Request) {
    const producto = await this.productosService.create(dto);
    this.loggService.log(
      `Producto creado: ${dto.nombre} (ID: ${producto.id})`,
      req,
    );
    return producto;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductoDto,
    @Req() req: Request,
  ) {
    const producto = await this.productosService.findOne(id);

    if (!producto) {
      this.loggService.warn(
        `Intento de actualizar un producto inexistente (ID: ${id})`,
        req,
      );
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    const productoActualizado = await this.productosService.update(id, dto);
    this.loggService.log(
      `Producto actualizado: ${dto.nombre} (ID: ${id})`,
      req,
    );
    return productoActualizado;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    await this.productosService.delete(id);
    this.loggService.log(`Producto eliminado (ID: ${id})`, req);
    return { message: `Producto con ID ${id} eliminado correctamente.` };
  }

  @Get('categoria/:categoriaId')
  async getByCategoria(@Param('categoriaId') categoriaId: number) {
    return await this.productosService.findByCategoria(categoriaId);
  }

  // Buscar productos por subcategoría
  @Get('subcategoria/:subcategoriaId')
  async getBySubcategoria(@Param('subcategoriaId') subcategoriaId: number) {
    return await this.productosService.findBySubcategoria(subcategoriaId);
  }
}
