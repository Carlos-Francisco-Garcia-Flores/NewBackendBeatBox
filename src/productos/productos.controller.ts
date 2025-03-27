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
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async getAll() {
    return await this.productosService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productosService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateProductoDto) {
    return await this.productosService.create(dto);
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductoDto,
  ) {
    return await this.productosService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.productosService.delete(id);
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
