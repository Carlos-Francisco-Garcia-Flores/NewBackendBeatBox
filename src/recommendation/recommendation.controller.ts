import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import {
  CreateRecommendationDto,
  CreateCartRecommendationDto,
} from './dto/create-recommendation.dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // Recomendación basada en un solo producto
  @Post()
  async getRecomendaciones(@Body() createRecommendationDto: CreateRecommendationDto) {
    return await this.recommendationService.getRecommendations(
      createRecommendationDto.producto,
      8,
    );
  }

  // Recomendación basada en productos en carrito
  @Post('carrito')
  async getRecomendacionesCarrito(@Body() body: CreateCartRecommendationDto) {
    return await this.recommendationService.getCartRecommendations(
      body.productos,
      8,
    );
  }

  // Endpoint GET para probar recomendaciones por nombre de producto
  @Get('producto/:nombre')
  async getByNombre(@Param('nombre') nombre: string) {
    return await this.recommendationService.getRecommendations(nombre, 8);
  }

  // Endpoint GET para probar recomendaciones por múltiples productos
  @Get('carrito-demo/:nombres')
  async getByNombres(@Param('nombres') nombres: string) {
    const productos = nombres.split(',');
    return await this.recommendationService.getCartRecommendations(productos, 8);
  }
}
