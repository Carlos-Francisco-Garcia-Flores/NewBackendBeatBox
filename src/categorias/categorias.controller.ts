import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async getAll() {
    return await this.categoriasService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriasService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateCategoriaDto) {
    return await this.categoriasService.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoriaDto) {
    return await this.categoriasService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoriasService.delete(id);
    return { message: 'Categoría eliminada correctamente' };
  }
}
