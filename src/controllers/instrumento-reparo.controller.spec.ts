/**
 * Testes unitários do InstrumentoReparoController.
 *
 * Estes testes garantem que o controlador de InstrumentoReparo delega
 * corretamente as operações ao InstrumentoReparoService. 
 * Todas as rotas HTTP (POST, GET, PATCH, DELETE) são verificadas para
 * assegurar que os parâmetros são repassados e os retornos são corretos.
 * A lógica de negócio (validações, exceções) é testada nos testes do Service.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentoReparoController } from './instrumento-reparo.controller';
import { InstrumentoReparoService } from '../services/instrumento-reparo.service';

/**
 * Mock (simulação) do InstrumentoReparoService.
 * Substitui cada método por jest.fn() para que possamos definir
 * retornos simulados e verificar se os métodos foram chamados corretamente.
 */
const mockInstrumentoReparoService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByLuthier: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('InstrumentoReparoController', () => {
  let controller: InstrumentoReparoController;

  /**
   * Antes de cada teste, cria um módulo NestJS de teste injetando
   * o mock do service no lugar do service real.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstrumentoReparoController],
      providers: [
        {
          provide: InstrumentoReparoService,
          useValue: mockInstrumentoReparoService,
        },
      ],
    }).compile();

    controller = module.get<InstrumentoReparoController>(InstrumentoReparoController);
  });

  /** Após cada teste, limpa o histórico de chamadas dos mocks */
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ───────────────────────────────────────────────
  // POST /instrumentos-reparo — Criar um novo instrumento em reparo
  // ───────────────────────────────────────────────
  describe('create (POST /instrumentos-reparo)', () => {
    it('deve chamar o service com os valores corretos e retornar o instrumento criado', async () => {
      const dto = {
        modeloMadeira: 'Violão Cedro',
        dataEntrada: new Date('2023-01-01'),
        reparoConcluido: false,
        custoReparo: 500,
        luthierId: 1,
      };
      const resultadoEsperado = { id: 1, ...dto };
      mockInstrumentoReparoService.create.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.create(dto);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockInstrumentoReparoService.create).toHaveBeenCalledWith(dto);
      expect(mockInstrumentoReparoService.create).toHaveBeenCalledTimes(1);
    });
  });

  // ───────────────────────────────────────────────
  // GET /instrumentos-reparo — Listar todos os instrumentos em reparo
  // ───────────────────────────────────────────────
  describe('findAll (GET /instrumentos-reparo)', () => {
    it('deve retornar uma lista de instrumentos em reparo', async () => {
      const resultadoEsperado = [{ id: 1, modeloMadeira: 'Violão Cedro' }];
      mockInstrumentoReparoService.findAll.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.findAll();

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockInstrumentoReparoService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ───────────────────────────────────────────────
  // GET /instrumentos-reparo/:id — Buscar instrumento pelo ID
  // ───────────────────────────────────────────────
  describe('findOne (GET /instrumentos-reparo/:id)', () => {
    it('deve chamar o service com o ID correto e retornar o instrumento encontrado', async () => {
      const resultadoEsperado = { id: 1, modeloMadeira: 'Violão Cedro' };
      mockInstrumentoReparoService.findOne.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.findOne(1);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockInstrumentoReparoService.findOne).toHaveBeenCalledWith(1);
    });
  });

  // ───────────────────────────────────────────────
  // GET /instrumentos-reparo/luthier/:luthierId — Listar instrumentos de um luthier
  // ───────────────────────────────────────────────
  describe('findByLuthier (GET /instrumentos-reparo/luthier/:luthierId)', () => {
    it('deve chamar o service com o luthierId correto e retornar os instrumentos do luthier', async () => {
      const resultadoEsperado = [{ id: 1, modeloMadeira: 'Violão Cedro' }];
      mockInstrumentoReparoService.findByLuthier.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.findByLuthier(1);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockInstrumentoReparoService.findByLuthier).toHaveBeenCalledWith(1);
    });
  });

  // ───────────────────────────────────────────────
  // PATCH /instrumentos-reparo/:id — Atualizar instrumento em reparo
  // ───────────────────────────────────────────────
  describe('update (PATCH /instrumentos-reparo/:id)', () => {
    it('deve chamar o service com o ID e os dados de atualização corretos', async () => {
      const dto = { custoReparo: 600 };
      const resultadoEsperado = { id: 1, modeloMadeira: 'Violão Cedro', custoReparo: 600 };
      mockInstrumentoReparoService.update.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.update(1, dto);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockInstrumentoReparoService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  // ───────────────────────────────────────────────
  // DELETE /instrumentos-reparo/:id — Remover instrumento em reparo
  // ───────────────────────────────────────────────
  describe('remove (DELETE /instrumentos-reparo/:id)', () => {
    it('deve chamar o service com o ID correto e retornar undefined', async () => {
      mockInstrumentoReparoService.remove.mockResolvedValue(undefined);

      const resultado = await controller.remove(1);

      expect(resultado).toBeUndefined();
      expect(mockInstrumentoReparoService.remove).toHaveBeenCalledWith(1);
    });
  });
});
