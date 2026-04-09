import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InstrumentoReparo } from '../entities/instrumento-reparo.entity';
import { IInstrumentoReparoRepository } from '../ports/instrumento-reparo.port';
import {
  CreateInstrumentoReparoDto,
  UpdateInstrumentoReparoDto,
} from '../dto/instrumento-reparo.dto';

@Injectable()
export class InstrumentoReparoRepository implements IInstrumentoReparoRepository {
  private repository: Repository<InstrumentoReparo>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(InstrumentoReparo);
  }

  async create(data: CreateInstrumentoReparoDto): Promise<InstrumentoReparo> {
    const instrumento = this.repository.create(data);
    return this.repository.save(instrumento);
  }

  async findAll(): Promise<InstrumentoReparo[]> {
    return this.repository.find({ relations: ['luthier'] });
  }

  async findOne(id: number): Promise<InstrumentoReparo | null> {
    return this.repository.findOne({ where: { id }, relations: ['luthier'] });
  }

  async findByLuthier(luthierId: number): Promise<InstrumentoReparo[]> {
    return this.repository.find({
      where: { luthierId },
      relations: ['luthier'],
    });
  }

  async update(
    id: number,
    data: UpdateInstrumentoReparoDto,
  ): Promise<InstrumentoReparo> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Instrumento não encontrado');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByModeloAndLuthier(
    modeloMadeira: string,
    luthierId: number,
    reparoConcluido: boolean,
  ): Promise<boolean> {
    const instrumento = await this.repository.findOne({
      where: { modeloMadeira, luthierId, reparoConcluido },
    });
    return !!instrumento;
  }
}
