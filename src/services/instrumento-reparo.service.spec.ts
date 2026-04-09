/**
 * Testes unitários do InstrumentoReparoService.
 *
 * Este arquivo testa toda a lógica de negócio relacionada a Instrumentos em Reparo:
 *
 * 1. CRIAÇÃO (create):
 *    - Campos obrigatórios: modeloMadeira, dataEntrada, reparoConcluido, custoReparo, luthierId
 *    - Validação de existência do Luthier associado
 *    - Data de entrada não pode ser no futuro
 *    - Data de entrada não pode ser anterior à data de abertura da oficina do Luthier
 *    - Custo do reparo deve ser > 0 e <= 50.000
 *    - Um reparo concluído não pode ter custo zero
 *    - Não pode haver instrumento duplicado (mesmo modelo + mesmo luthier + reparo não concluído)
 *
 * 2. BUSCA:
 *    - findAll retorna todos os instrumentos
 *    - findOne retorna por ID ou lança erro se não encontrar
 *    - findByLuthier retorna instrumentos de um luthier específico
 *
 * 3. ATUALIZAÇÃO (update):
 *    - Lança erro se o instrumento não existir
 *    - Revalida campos alterados
 *
 * 4. REMOÇÃO (remove):
 *    - Delega ao repositório
 *
 * NOTA: Como o InstrumentoReparoService usa `import type` para as interfaces
 * dos repositórios, o NestJS não consegue resolver as dependências pelo sistema
 * de módulos de teste (as interfaces são apagadas em tempo de execução).
 * Por isso, instanciamos o Service diretamente passando os mocks no construtor.
 */
import { InstrumentoReparoService } from './instrumento-reparo.service';
import {
  CamposObrigatoriosException,
  DataFuturaException,
  DataInconsistenteException,
  CustoReparoInvalidoException,
  ReparoConcluidoSemCustoException,
} from '../exceptions/luthier.exceptions';
import {
  LuthierNaoEncontradoParaInstrumentoException,
  InstrumentoDuplicadoException,
} from '../exceptions/instrumento-reparo.exceptions';
import { CreateInstrumentoReparoDto } from '../dto/instrumento-reparo.dto';

/**
 * Mock do repositório IInstrumentoReparoRepository.
 * Simula as operações de CRUD e a consulta de duplicados.
 */
const mockInstrumentoReparoRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByLuthier: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  existsByModeloAndLuthier: jest.fn(),
};

/**
 * Mock do repositório ILuthierRepository.
 * Usado para validar se o luthier existe e obter seus dados (ex: dataAbertura).
 */
const mockLuthierRepository = {
  findOne: jest.fn(),
  exists: jest.fn(),
};

describe('InstrumentoReparoService', () => {
  let service: InstrumentoReparoService;

  /**
   * Antes de cada teste, instancia o InstrumentoReparoService diretamente
   * passando os mocks dos dois repositórios no construtor.
   */
  beforeEach(() => {
    service = new InstrumentoReparoService(
      mockInstrumentoReparoRepository as any,
      mockLuthierRepository as any,
    );
  });

  /** Após cada teste, limpa o histórico de chamadas dos mocks */
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // ═══════════════════════════════════════════════
  // Testes de criação de Instrumento em Reparo
  // ═══════════════════════════════════════════════
  describe('create - Criação de instrumento em reparo', () => {
    /** DTO base reutilizado nos testes. Redefinido antes de cada teste. */
    let dto: CreateInstrumentoReparoDto;

    beforeEach(() => {
      dto = {
        modeloMadeira: 'Violão Cedro',
        dataEntrada: new Date('2023-01-01'),
        reparoConcluido: false,
        custoReparo: 500,
        luthierId: 1,
      };
    });

    it('deve criar um instrumento com sucesso quando todos os dados são válidos', async () => {
      // Simula: luthier existe, data de abertura anterior à entrada, sem duplicatas
      mockLuthierRepository.exists.mockResolvedValue(true);
      mockLuthierRepository.findOne.mockResolvedValue({
        id: 1,
        dataAbertura: new Date('2020-01-01'),
      });
      mockInstrumentoReparoRepository.existsByModeloAndLuthier.mockResolvedValue(false);

      const resultadoEsperado = { id: 1, ...dto };
      mockInstrumentoReparoRepository.create.mockResolvedValue(resultadoEsperado);

      const resultado = await service.create(dto);

      expect(resultado).toEqual(resultadoEsperado);
    });

    // ─── Validação de campos obrigatórios ───

    it('deve lançar CamposObrigatoriosException quando modeloMadeira está vazio', async () => {
      await expect(service.create({ ...dto, modeloMadeira: '' }))
        .rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando dataEntrada não foi informada', async () => {
      await expect(service.create({ ...dto, dataEntrada: undefined } as any))
        .rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando reparoConcluido não foi informado', async () => {
      await expect(service.create({ ...dto, reparoConcluido: undefined } as any))
        .rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando custoReparo não foi informado', async () => {
      await expect(service.create({ ...dto, custoReparo: undefined } as any))
        .rejects.toThrow(CamposObrigatoriosException);
    });

    it('deve lançar CamposObrigatoriosException quando luthierId não foi informado', async () => {
      await expect(service.create({ ...dto, luthierId: undefined } as any))
        .rejects.toThrow(CamposObrigatoriosException);
    });

    // ─── Validação de existência do Luthier ───

    it('deve lançar LuthierNaoEncontradoParaInstrumentoException quando o luthier não existe', async () => {
      mockLuthierRepository.exists.mockResolvedValue(false);

      await expect(service.create(dto))
        .rejects.toThrow(LuthierNaoEncontradoParaInstrumentoException);
    });

    // ─── Validação de datas ───

    it('deve lançar DataFuturaException quando dataEntrada é uma data no futuro', async () => {
      mockLuthierRepository.exists.mockResolvedValue(true);

      const dataFutura = new Date();
      dataFutura.setDate(dataFutura.getDate() + 1); // amanhã
      dto.dataEntrada = dataFutura;

      await expect(service.create(dto)).rejects.toThrow(DataFuturaException);
    });

    it('deve lançar DataInconsistenteException quando dataEntrada é anterior à dataAbertura do luthier', async () => {
      mockLuthierRepository.exists.mockResolvedValue(true);
      // Luthier abriu a oficina em 2024, mas o instrumento teria entrado em 2023
      mockLuthierRepository.findOne.mockResolvedValue({
        id: 1,
        dataAbertura: new Date('2024-01-01'),
      });

      await expect(service.create(dto)).rejects.toThrow(DataInconsistenteException);
    });

    // ─── Validação de custo do reparo ───

    it('deve lançar CustoReparoInvalidoException quando custoReparo é igual a zero', async () => {
      mockLuthierRepository.exists.mockResolvedValue(true);
      mockLuthierRepository.findOne.mockResolvedValue({
        id: 1,
        dataAbertura: new Date('2020-01-01'),
      });

      dto.custoReparo = 0;

      await expect(service.create(dto)).rejects.toThrow(CustoReparoInvalidoException);
    });

    it('deve lançar CustoReparoInvalidoException quando custoReparo é maior que 50.000', async () => {
      mockLuthierRepository.exists.mockResolvedValue(true);
      mockLuthierRepository.findOne.mockResolvedValue({
        id: 1,
        dataAbertura: new Date('2020-01-01'),
      });

      dto.custoReparo = 50001;

      await expect(service.create(dto)).rejects.toThrow(CustoReparoInvalidoException);
    });

    // ─── Validação de reparo concluído sem custo ───

    it('deve lançar ReparoConcluidoSemCustoException quando reparo está concluído mas custo é zero', async () => {
      /**
       * Nota: no fluxo normal do create, a validação de custo > 0 (CustoReparoInvalidoException)
       * é executada antes da validação de reparo concluído sem custo. Por isso, testamos
       * diretamente o método privado validarReparoConcluidoComCusto para isolar essa regra.
       */
      expect(() => {
        (service as any).validarReparoConcluidoComCusto(true, 0);
      }).toThrow(ReparoConcluidoSemCustoException);
    });

    // ─── Validação de instrumento duplicado ───

    it('deve lançar InstrumentoDuplicadoException quando já existe mesmo modelo com reparo pendente para o mesmo luthier', async () => {
      mockLuthierRepository.exists.mockResolvedValue(true);
      mockLuthierRepository.findOne.mockResolvedValue({
        id: 1,
        dataAbertura: new Date('2020-01-01'),
      });
      // Simula que já existe um instrumento com o mesmo modelo para esse luthier
      mockInstrumentoReparoRepository.existsByModeloAndLuthier.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(InstrumentoDuplicadoException);
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de busca de instrumentos
  // ═══════════════════════════════════════════════
  describe('findAll - Listar todos os instrumentos', () => {
    it('deve retornar uma lista de instrumentos em reparo', async () => {
      const resultadoEsperado = [{ id: 1, modeloMadeira: 'Violão Cedro' }];
      mockInstrumentoReparoRepository.findAll.mockResolvedValue(resultadoEsperado);

      const resultado = await service.findAll();

      expect(resultado).toEqual(resultadoEsperado);
    });
  });

  describe('findOne - Buscar instrumento por ID', () => {
    it('deve retornar o instrumento quando encontrado', async () => {
      const resultadoEsperado = { id: 1, modeloMadeira: 'Violão Cedro' };
      mockInstrumentoReparoRepository.findOne.mockResolvedValue(resultadoEsperado);

      const resultado = await service.findOne(1);

      expect(resultado).toEqual(resultadoEsperado);
    });

    it('deve lançar erro com a mensagem "Instrumento não encontrado" quando o ID não existe', async () => {
      mockInstrumentoReparoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('Instrumento não encontrado');
    });
  });

  describe('findByLuthier - Listar instrumentos de um luthier', () => {
    it('deve retornar a lista de instrumentos associados ao luthier', async () => {
      const resultadoEsperado = [{ id: 1, modeloMadeira: 'Violão Cedro' }];
      mockInstrumentoReparoRepository.findByLuthier.mockResolvedValue(resultadoEsperado);

      const resultado = await service.findByLuthier(1);

      expect(resultado).toEqual(resultadoEsperado);
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de atualização de instrumento em reparo
  // ═══════════════════════════════════════════════
  describe('update - Atualizar instrumento em reparo', () => {
    it('deve lançar erro com a mensagem "Instrumento não encontrado" quando o instrumento não existe', async () => {
      mockInstrumentoReparoRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow('Instrumento não encontrado');
    });

    it('deve atualizar o instrumento com sucesso quando os dados são válidos', async () => {
      // Simula o instrumento existente no banco
      mockInstrumentoReparoRepository.findOne.mockResolvedValue({
        id: 1,
        luthierId: 1,
        dataEntrada: new Date('2023-01-01'),
        reparoConcluido: false,
        custoReparo: 100,
      });
      mockLuthierRepository.findOne.mockResolvedValue({
        id: 1,
        dataAbertura: new Date('2020-01-01'),
      });

      const resultadoEsperado = { id: 1, custoReparo: 200 };
      mockInstrumentoReparoRepository.update.mockResolvedValue(resultadoEsperado);

      const resultado = await service.update(1, { custoReparo: 200 });

      expect(resultado).toEqual(resultadoEsperado);
    });
  });

  // ═══════════════════════════════════════════════
  // Testes de remoção de instrumento em reparo
  // ═══════════════════════════════════════════════
  describe('remove - Remover instrumento em reparo', () => {
    it('deve chamar o repositório para remover o instrumento pelo ID', async () => {
      mockInstrumentoReparoRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockInstrumentoReparoRepository.remove).toHaveBeenCalledWith(1);
    });
  });
});
