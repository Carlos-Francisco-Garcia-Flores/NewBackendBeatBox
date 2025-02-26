import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './producto.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  //  Obtener todos los productos (Sin autenticación)
  @Get()
  async getAll() {
    return await this.productosService.findAll();
  }

  //  Obtener un solo producto por ID
  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productosService.findOne(id);
  }

  //  Crear un producto con imagen en Cloudinary
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('imagen')) // Permite subir archivos
  async create(@UploadedFile() imagen: Express.Multer.File, @Body() dto: CreateProductoDto) {
    return await this.productosService.create(dto, imagen?.path);
  }

  //  Actualizar un producto con nueva imagen
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  async update(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() imagen: Express.Multer.File, @Body() dto: UpdateProductoDto) {
    return await this.productosService.update(id, dto, imagen?.path);
  }

  //  Eliminar un producto y su imagen de Cloudinary
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.productosService.delete(id);
    return { message: `Producto con ID ${id} eliminado correctamente.` };
  }
}
