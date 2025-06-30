import { Test, TestingModule } from '@nestjs/testing';
import { ImagenesProductosService } from './imagenes-productos.service';

describe('ImagenesProductosService', () => {
  let service: ImagenesProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagenesProductosService],
    }).compile();

    service = module.get<ImagenesProductosService>(ImagenesProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
