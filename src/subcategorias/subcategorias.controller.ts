import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SubcategoriaService } from './subcategorias.service';
import {
  UpdateSubcategoriaDto,
  CreateSubcategoriaDto,
} from './subcategoria.dto';
import { Subcategoria } from './subcategoria.entity';

@Controller('subcategorias')
export class SubcategoriaController {
  constructor(private readonly subcategoriaService: SubcategoriaService) {}

  @Post()
  async create(
    @Body() createSubcategoriaDto: CreateSubcategoriaDto,
  ): Promise<Subcategoria> {
    return this.subcategoriaService.create(createSubcategoriaDto);
  }

  @Get()
  async findAll(): Promise<Subcategoria[]> {
    return this.subcategoriaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Subcategoria> {
    return this.subcategoriaService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSubcategoriaDto: UpdateSubcategoriaDto,
  ): Promise<Subcategoria> {
    return this.subcategoriaService.update(id, updateSubcategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.subcategoriaService.remove(id);
  }
  @Get('by-categoria/:categoriaId')
  async findByCategoria(
    @Param('categoriaId') categoriaId: number,
  ): Promise<Subcategoria[]> {
    return this.subcategoriaService.findByCategoria(categoriaId);
  }
}
