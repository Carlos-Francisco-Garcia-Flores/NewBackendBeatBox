import { Test, TestingModule } from '@nestjs/testing';
import { VentasController } from './venta.controller';

describe('VentaController', () => {
  let controller: VentasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentasController],
    }).compile();

    controller = module.get<VentasController>(VentasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
