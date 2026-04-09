/**
 * Testes unitários do LuthierService.
 *
 * Este arquivo testa toda a lógica de negócio relacionada a Luthiers:
 * - Criação com validação de campos obrigatórios
 * - Validação de data de abertura (não pode ser no futuro)
 * - Validação de número mínimo de bancadas (deve ser >= 2)
 * - Busca por ID (deve lançar erro se não encontrar)
 * - Atualização com revalidação dos campos alterados
 * - Remoção
 *
 * O repositório (ILuthierRepository) é substituído por um mock (simulação),
 * para que os testes sejam isolados e não dependam de banco de dados real.
 *
 * NOTA: Como o LuthierService usa `import type` para a interface do repositório,
 * o NestJS não consegue resolver a dependência pelo sistema de módulos de teste.
 * Por isso, instanciamos o Service diretamente passando o mock no construtor.
 */
import { LuthierService } from './luthier.service';
import {
  CamposObrigatoriosException,
  DataFuturaException,
  BancadasInsuficientesException,
} from '../exceptions/luthier.exceptions';
import { CreateLuthierDto } from '../dto/luthier.dto';

/**
 * Mock do repositório ILuthierRepository.
 * Simula as operações de banco de dados (create, findAll, findOne, etc.)
 * para que o teste foque apenas na lógica do Service.
 */
const mockLuthierRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  exists: jest.fn(),
};

describe('LuthierService', () => {
  let service: LuthierService;

  /**
   * Antes de cada teste, instancia o LuthierService diretamente
   * passando o mock do repositório no construtor.
   */
  beforeEach(() => {
    service = new LuthierService(mockLuthierRepository as any);
  });

  /** Após cada teste, limpa o histórico de chamadas dos mocks */
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // ═══════════════════════════════════════════════
  // Testes de criação de Luthier
  // ═══════════════════════════════════════════════
  describe('create - Criação de Luthier', () => {
    it('deve criar um luthier com sucesso quando todos os dados são válidos', async () => {
      const dto: CreateLuthierDto = {
        nomeMestre: 'João Luthier',
        dataAbertura: new Date('2020-01-01'),
        certificada: true,
        bancadasNum: 2,
      };

      const resultadoEsperado = { id: 1, ...dto };
      mockLuthierRepository.create.mockResolvedValue(resultadoEsperado);

      const resultado = await service.create(dto);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockLuthierRepository.create).toHaveBeenCalledWith(dto);
    });

    // ─── Validação de campos obrigatórios ───

    it('deve lançar CamposObrigatoriosException quando nomeMestre está vazio', async () => {
      const dto = {
        nomeMestre: '   ', // nome em branco
        dataAbertura: new Date('2020-01-01'),
        certificada: true,
        bancadasNum: 3,
      } as CreateLuthierDto;

      await expect(service.create(dto)).rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando dataAbertura não foi informada', async () => {
      const dto = {
        nomeMestre: 'João',
        certificada: true,
        bancadasNum: 3,
      } as CreateLuthierDto;

      await expect(service.create(dto)).rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando certificada não foi informada', async () => {
      const dto = {
        nomeMestre: 'João',
        dataAbertura: new Date('2020-01-01'),
        bancadasNum: 3,
      } as CreateLuthierDto;

      await expect(service.create(dto)).rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando bancadasNum não foi informado', async () => {
      const dto = {
        nomeMestre: 'João',
        dataAbertura: new Date('2020-01-01'),
        certificada: true,
      } as CreateLuthierDto;

      await expect(service.create(dto)).rejects.toThrow(CamposObrigatoriosException);
    });

    // ─── Validação de regras de negócio ───

    it('deve lançar DataFuturaException quando dataAbertura é uma data no futuro', async () => {
      const dataFutura = new Date();
      dataFutura.setDate(dataFutura.getDate() + 1); // amanhã

      const dto: CreateLuthierDto = {
        nomeMestre: 'João Luthier',
        dataAbertura: dataFutura,
        certificada: true,
        bancadasNum: 2,
      };

      await expect(service.create(dto)).rejects.toThrow(DataFuturaException);
    });

    it('deve lançar BancadasInsuficientesException quando bancadasNum é menor que 2', async () => {
      const dto: CreateLuthierDto = {
        nomeMestre: 'João Luthier',
        dataAbertura: new Date('2020-01-01'),
        certificada: true,
        bancadasNum: 1, // mínimo exigido é 2
      };

      await expect(service.create(dto)).rejects.toThrow(BancadasInsuficientesException);
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de listagem de Luthiers
  // ═══════════════════════════════════════════════
  describe('findAll - Listar todos os luthiers', () => {
    it('deve retornar uma lista de luthiers', async () => {
      const resultadoEsperado = [{ id: 1, nomeMestre: 'João Luthier' }];
      mockLuthierRepository.findAll.mockResolvedValue(resultadoEsperado);

      const resultado = await service.findAll();

      expect(resultado).toEqual(resultadoEsperado);
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de busca por ID
  // ═══════════════════════════════════════════════
  describe('findOne - Buscar luthier por ID', () => {
    it('deve retornar o luthier quando encontrado', async () => {
      const resultadoEsperado = { id: 1, nomeMestre: 'João Luthier' };
      mockLuthierRepository.findOne.mockResolvedValue(resultadoEsperado);

      const resultado = await service.findOne(1);

      expect(resultado).toEqual(resultadoEsperado);
    });

    it('deve lançar erro com a mensagem "Luthier não encontrado" quando o ID não existe', async () => {
      mockLuthierRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('Luthier não encontrado');
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de atualização de Luthier
  // ═══════════════════════════════════════════════
  describe('update - Atualizar luthier', () => {
    it('deve atualizar o luthier com sucesso quando os dados são válidos', async () => {
      const dto = { bancadasNum: 3 };
      const resultadoEsperado = { id: 1, bancadasNum: 3 };
      mockLuthierRepository.update.mockResolvedValue(resultadoEsperado);

      const resultado = await service.update(1, dto);

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockLuthierRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve lançar DataFuturaException ao tentar atualizar dataAbertura para uma data futura', async () => {
      const dataFutura = new Date();
      dataFutura.setDate(dataFutura.getDate() + 1);

      await expect(service.update(1, { dataAbertura: dataFutura }))
        .rejects.toThrow(DataFuturaException);
    });

    it('deve lançar BancadasInsuficientesException ao tentar atualizar bancadasNum para valor menor que 2', async () => {
      await expect(service.update(1, { bancadasNum: 0 }))
        .rejects.toThrow(BancadasInsuficientesException);
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de remoção de Luthier
  // ═══════════════════════════════════════════════
  describe('remove - Remover luthier', () => {
    it('deve chamar o repositório para remover o luthier pelo ID', async () => {
      mockLuthierRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockLuthierRepository.remove).toHaveBeenCalledWith(1);
    });
  });
});
