/**
 * Testes unitários do LuthierController.
 *
 * O objetivo destes testes é garantir que o controlador (camada de entrada HTTP)
 * repassa corretamente os parâmetros recebidos para o LuthierService e retorna
 * as respostas esperadas. Aqui NÃO testamos regras de negócio — isso é
 * responsabilidade dos testes do Service. Usamos um mock do LuthierService para
 * isolar o controlador de qualquer lógica real.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { LuthierController } from './luthier.controller';
import { LuthierService } from '../services/luthier.service';

/**
 * Mock (simulação) do LuthierService.
 * Cada método é substituído por uma função jest.fn() que permite
 * verificar se foi chamado, com quais argumentos, e definir retornos simulados.
 */
const mockLuthierService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('LuthierController', () => {
  let controller: LuthierController;

  /**
   * Antes de cada teste, cria um módulo NestJS de teste injetando
   * o mock do service no lugar do service real.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LuthierController],
      providers: [
        {
          provide: LuthierService,
          useValue: mockLuthierService,
        },
      ],
    }).compile();

    controller = module.get<LuthierController>(LuthierController);
  });

  /** Após cada teste, limpa o histórico de chamadas dos mocks */
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ───────────────────────────────────────────────
  // POST /luthiers — Criar um novo luthier
  // ───────────────────────────────────────────────
  describe('create (POST /luthiers)', () => {
    it('deve chamar luthierService.create com os valores corretos e retornar o luthier criado', async () => {
      const dto = {
        nomeMestre: 'João Silva',
        dataAbertura: new Date('2020-01-01'),
        certificada: true,
        bancadasNum: 5,
      };
      const resultadoEsperado = { id: 1, ...dto };
      mockLuthierService.create.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.create(dto);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockLuthierService.create).toHaveBeenCalledWith(dto);
      expect(mockLuthierService.create).toHaveBeenCalledTimes(1);
    });
  });

  // ───────────────────────────────────────────────
  // GET /luthiers — Listar todos os luthiers
  // ───────────────────────────────────────────────
  describe('findAll (GET /luthiers)', () => {
    it('deve retornar uma lista de luthiers', async () => {
      const resultadoEsperado = [
        { id: 1, nomeMestre: 'João Silva' },
        { id: 2, nomeMestre: 'Maria Oliveira' },
      ];
      mockLuthierService.findAll.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.findAll();

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockLuthierService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ───────────────────────────────────────────────
  // GET /luthiers/:id — Buscar um luthier pelo ID
  // ───────────────────────────────────────────────
  describe('findOne (GET /luthiers/:id)', () => {
    it('deve chamar luthierService.findOne com o ID correto e retornar o luthier', async () => {
      const resultadoEsperado = { id: 1, nomeMestre: 'João Silva' };
      mockLuthierService.findOne.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.findOne(1);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockLuthierService.findOne).toHaveBeenCalledWith(1);
    });
  });

  // ───────────────────────────────────────────────
  // PATCH /luthiers/:id — Atualizar um luthier
  // ───────────────────────────────────────────────
  describe('update (PATCH /luthiers/:id)', () => {
    it('deve chamar luthierService.update com o ID e os dados corretos', async () => {
      const dto = { certificada: false };
      const resultadoEsperado = { id: 1, nomeMestre: 'João Silva', certificada: false };
      mockLuthierService.update.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.update(1, dto);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockLuthierService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  // ───────────────────────────────────────────────
  // DELETE /luthiers/:id — Remover um luthier
  // ───────────────────────────────────────────────
  describe('remove (DELETE /luthiers/:id)', () => {
    it('deve chamar luthierService.remove com o ID correto', async () => {
      mockLuthierService.remove.mockResolvedValue(undefined);

      const resultado = await controller.remove(1);

      expect(resultado).toBeUndefined();
      expect(mockLuthierService.remove).toHaveBeenCalledWith(1);
    });
  });
});
