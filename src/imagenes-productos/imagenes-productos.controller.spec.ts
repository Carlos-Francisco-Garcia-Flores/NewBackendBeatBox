import { Test, TestingModule } from '@nestjs/testing';
import { ImagenesProductosController } from './imagenes-productos.controller';

describe('ImagenesProductosController', () => {
  let controller: ImagenesProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagenesProductosController],
    }).compile();

    controller = module.get<ImagenesProductosController>(ImagenesProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
