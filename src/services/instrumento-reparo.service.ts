import { Injectable } from '@nestjs/common';
import type { IInstrumentoReparoRepository } from '../ports/instrumento-reparo.port';
import type { ILuthierRepository } from '../ports/luthier.port';
import {
  CreateInstrumentoReparoDto,
  UpdateInstrumentoReparoDto,
} from '../dto/instrumento-reparo.dto';
import { InstrumentoReparo } from '../entities/instrumento-reparo.entity';
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

@Injectable()
export class InstrumentoReparoService {
  constructor(
    private readonly instrumentoReparoRepository: IInstrumentoReparoRepository,
    private readonly luthierRepository: ILuthierRepository,
  ) {}

  async create(data: CreateInstrumentoReparoDto): Promise<InstrumentoReparo> {
    this.validarCamposObrigatorios(data);
    await this.validarLuthierExiste(data.luthierId);
    await this.validarDataConsistente(data.dataEntrada, data.luthierId);
    this.validarCustoReparo(data.custoReparo);
    this.validarReparoConcluidoComCusto(data.reparoConcluido, data.custoReparo);
    await this.validarInstrumentoDuplicado(
      data.modeloMadeira,
      data.luthierId,
      data.reparoConcluido,
    );

    return this.instrumentoReparoRepository.create(data);
  }

  async findAll(): Promise<InstrumentoReparo[]> {
    return this.instrumentoReparoRepository.findAll();
  }

  async findOne(id: number): Promise<InstrumentoReparo> {
    const instrumento = await this.instrumentoReparoRepository.findOne(id);
    if (!instrumento) {
      throw new Error('Instrumento não encontrado');
    }
    return instrumento;
  }

  async findByLuthier(luthierId: number): Promise<InstrumentoReparo[]> {
    return this.instrumentoReparoRepository.findByLuthier(luthierId);
  }

  async update(
    id: number,
    data: UpdateInstrumentoReparoDto,
  ): Promise<InstrumentoReparo> {
    const instrumentoExistente =
      await this.instrumentoReparoRepository.findOne(id);
    if (!instrumentoExistente) {
      throw new Error('Instrumento não encontrado');
    }

    if (data.dataEntrada || data.luthierId) {
      const luthierId = data.luthierId || instrumentoExistente.luthierId;
      await this.validarDataConsistente(
        data.dataEntrada || instrumentoExistente.dataEntrada,
        luthierId,
      );
    }
    if (data.custoReparo !== undefined) {
      this.validarCustoReparo(data.custoReparo);
    }
    if (data.reparoConcluido !== undefined || data.custoReparo !== undefined) {
      const reparoConcluido =
        data.reparoConcluido ?? instrumentoExistente.reparoConcluido;
      const custoReparo = data.custoReparo ?? instrumentoExistente.custoReparo;
      this.validarReparoConcluidoComCusto(reparoConcluido, custoReparo);
    }
    if (data.modeloMadeira && data.luthierId) {
      const luthierId = data.luthierId;
      const reparoConcluido =
        data.reparoConcluido ?? instrumentoExistente.reparoConcluido;
      await this.validarInstrumentoDuplicado(
        data.modeloMadeira,
        luthierId,
        reparoConcluido,
        id,
      );
    }

    return this.instrumentoReparoRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.instrumentoReparoRepository.remove(id);
  }

  private validarCamposObrigatorios(data: CreateInstrumentoReparoDto): void {
    if (!data.modeloMadeira || data.modeloMadeira.trim() === '') {
      throw new CamposObrigatoriosException('modeloMadeira');
    }
    if (!data.dataEntrada) {
      throw new CamposObrigatoriosException('dataEntrada');
    }
    if (data.reparoConcluido === undefined || data.reparoConcluido === null) {
      throw new CamposObrigatoriosException('reparoConcluido');
    }
    if (data.custoReparo === undefined || data.custoReparo === null) {
      throw new CamposObrigatoriosException('custoReparo');
    }
    if (data.luthierId === undefined || data.luthierId === null) {
      throw new CamposObrigatoriosException('luthierId');
    }
  }

  private async validarLuthierExiste(luthierId: number): Promise<void> {
    const exists = await this.luthierRepository.exists(luthierId);
    if (!exists) {
      throw new LuthierNaoEncontradoParaInstrumentoException(luthierId);
    }
  }

  private async validarDataConsistente(
    dataEntrada: Date,
    luthierId: number,
  ): Promise<void> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(dataEntrada);

    if (data > hoje) {
      throw new DataFuturaException('dataEntrada');
    }

    const luthier = await this.luthierRepository.findOne(luthierId);
    if (luthier) {
      const dataAbertura = new Date(luthier.dataAbertura);
      dataAbertura.setHours(0, 0, 0, 0);
      const dataEntradaObj = new Date(dataEntrada);
      dataEntradaObj.setHours(0, 0, 0, 0);

      if (dataEntradaObj < dataAbertura) {
        throw new DataInconsistenteException(
          'A data de entrada não pode ser anterior à data de abertura da oficina',
        );
      }
    }
  }

  private validarCustoReparo(custoReparo: number): void {
    if (custoReparo <= 0 || custoReparo > 50000) {
      throw new CustoReparoInvalidoException();
    }
  }

  private validarReparoConcluidoComCusto(
    reparoConcluido: boolean,
    custoReparo: number,
  ): void {
    if (reparoConcluido && custoReparo === 0) {
      throw new ReparoConcluidoSemCustoException();
    }
  }

  private async validarInstrumentoDuplicado(
    modeloMadeira: string,
    luthierId: number,
    reparoConcluido: boolean,
    excludeId?: number,
  ): Promise<void> {
    if (!reparoConcluido) {
      const exists =
        await this.instrumentoReparoRepository.existsByModeloAndLuthier(
          modeloMadeira,
          luthierId,
          false,
        );
      if (exists && excludeId) {
        const instrumento =
          await this.instrumentoReparoRepository.findOne(excludeId);
        if (instrumento && instrumento.modeloMadeira === modeloMadeira) {
          return;
        }
      }
      if (exists) {
        throw new InstrumentoDuplicadoException(modeloMadeira);
      }
    }
  }
}
