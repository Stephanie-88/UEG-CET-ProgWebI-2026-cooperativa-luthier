import { Injectable } from '@nestjs/common';
import type { ILuthierRepository } from '../ports/luthier.port';
import { CreateLuthierDto, UpdateLuthierDto } from '../dto/luthier.dto';
import { Luthier } from '../entities/luthier.entity';
import {
  CamposObrigatoriosException,
  DataFuturaException,
  BancadasInsuficientesException,
} from '../exceptions/luthier.exceptions';

@Injectable()
export class LuthierService {
  constructor(private readonly luthierRepository: ILuthierRepository) {}

  async create(data: CreateLuthierDto): Promise<Luthier> {
    this.validarCamposObrigatorios(data);
    this.validarDataAbertura(data.dataAbertura);
    this.validarBancadas(data.bancadasNum);

    return this.luthierRepository.create(data);
  }

  async findAll(): Promise<Luthier[]> {
    return this.luthierRepository.findAll();
  }

  async findOne(id: number): Promise<Luthier> {
    const luthier = await this.luthierRepository.findOne(id);
    if (!luthier) {
      throw new Error('Luthier não encontrado');
    }
    return luthier;
  }

  async update(id: number, data: UpdateLuthierDto): Promise<Luthier> {
    if (data.dataAbertura) {
      this.validarDataAbertura(data.dataAbertura);
    }
    if (data.bancadasNum !== undefined) {
      this.validarBancadas(data.bancadasNum);
    }

    return this.luthierRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.luthierRepository.remove(id);
  }

  private validarCamposObrigatorios(data: CreateLuthierDto): void {
    if (!data.nomeMestre || data.nomeMestre.trim() === '') {
      throw new CamposObrigatoriosException('nomeMestre');
    }
    if (!data.dataAbertura) {
      throw new CamposObrigatoriosException('dataAbertura');
    }
    if (data.certificada === undefined || data.certificada === null) {
      throw new CamposObrigatoriosException('certificada');
    }
    if (data.bancadasNum === undefined || data.bancadasNum === null) {
      throw new CamposObrigatoriosException('bancadasNum');
    }
  }

  private validarDataAbertura(dataAbertura: Date): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(dataAbertura);

    if (data > hoje) {
      throw new DataFuturaException('dataAbertura');
    }
  }

  private validarBancadas(bancadasNum: number): void {
    if (bancadasNum < 2) {
      throw new BancadasInsuficientesException();
    }
  }
}
