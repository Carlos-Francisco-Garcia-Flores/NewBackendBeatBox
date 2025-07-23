import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Producto } from '../productos/producto.entity';
import { Categoria } from '../categorias/categoria.entity';
import { ProductosService } from '../productos/productos.service'; // nuevo

@Injectable()
export class RecommendationService {
  private rules: any[];

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
    private readonly productosService: ProductosService, // nuevo
  ) {
    const rulesPath = path.resolve(
      process.cwd(),
      'src',
      'recommendation',
      'data',
      'reglas_asociacion.json',
    );

    try {
      const rawData = fs.readFileSync(rulesPath, 'utf-8');
      this.rules = JSON.parse(rawData);
    } catch (error) {
      console.error('Error al cargar reglas de asociación:', error.message);
      this.rules = [];
    }
  }

  async getRecommendations(nombre: string, top_n = 5) {
    const recomendaciones: { name: string; lift: number; confidence: number }[] = [];
    const nombresAgregados = new Set<string>();

    const filtered = this.rules
      .filter((rule) => rule.antecedents.includes(nombre))
      .sort((a, b) => {
        if (b.lift !== a.lift) return b.lift - a.lift;
        return b.confidence - a.confidence;
      });

    for (const rule of filtered) {
      for (const item of rule.consequents) {
        if (item !== nombre && !nombresAgregados.has(item)) {
          recomendaciones.push({ name: item, lift: rule.lift, confidence: rule.confidence });
          nombresAgregados.add(item);
          if (recomendaciones.length >= top_n) break;
        }
      }
      if (recomendaciones.length >= top_n) break;
    }

    // Si no se encontró ninguna regla, buscar por categoría
    if (recomendaciones.length === 0) {
      const original = await this.productosService.findByNombre(nombre);

      if (original?.categoria) {
        return await this.productoRepo.find({
          where: {
            categoria: { id: original.categoria.id },
            nombre: Not(nombre),
          },
          take: 8,
          relations: ['categoria', 'subcategorias'],
        });
      }

      return [];
    }

    const productos = await this.productoRepo.find({
      where: recomendaciones.map((r) => ({ nombre: r.name })),
      relations: ['categoria', 'subcategorias'],
    });

    return recomendaciones
      .map((r) => {
        const prod = productos.find((p) => p.nombre === r.name);
        return prod ? { ...prod, lift: r.lift, confidence: r.confidence } : null;
      })
      .filter(Boolean);
  }

  async getCartRecommendations(productos: string[], top_n = 5) {
    const recomendaciones: { name: string; lift: number; confidence: number }[] = [];
    const nombresAgregados = new Set<string>();

    for (const producto of productos) {
      const filtered = this.rules
        .filter((rule) => rule.antecedents.includes(producto))
        .sort((a, b) => {
          if (b.lift !== a.lift) return b.lift - a.lift;
          return b.confidence - a.confidence;
        });

      for (const rule of filtered) {
        for (const item of rule.consequents) {
          if (!productos.includes(item) && !nombresAgregados.has(item)) {
            recomendaciones.push({ name: item, lift: rule.lift, confidence: rule.confidence });
            nombresAgregados.add(item);
            if (recomendaciones.length >= top_n) break;
          }
        }
        if (recomendaciones.length >= top_n) break;
      }

      if (recomendaciones.length >= top_n) break;
    }

    if (recomendaciones.length === 0 && productos.length > 0) {
      const base = await this.productosService.findByNombre(productos[0]);

      if (base?.categoria) {
        return await this.productoRepo.find({
          where: {
            categoria: { id: base.categoria.id },
            nombre: Not(In(productos)),
          },
          take: 8,
          relations: ['categoria', 'subcategorias'],
        });
      }

      return [];
    }

    const productosDB = await this.productoRepo.find({
      where: recomendaciones.map((r) => ({ nombre: r.name })),
      relations: ['categoria', 'subcategorias'],
    });

    return recomendaciones
      .map((r) => {
        const prod = productosDB.find((p) => p.nombre === r.name);
        return prod ? { ...prod, lift: r.lift, confidence: r.confidence } : null;
      })
      .filter(Boolean);
  }
}
