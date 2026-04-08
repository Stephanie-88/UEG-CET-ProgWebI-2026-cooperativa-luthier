import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Luthier } from '../entities/luthier.entity';
import { ILuthierRepository } from '../ports/luthier.port';
import { CreateLuthierDto, UpdateLuthierDto } from '../dto/luthier.dto';

@Injectable()
export class LuthierRepository implements ILuthierRepository {
  private repository: Repository<Luthier>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Luthier);
  }

  async create(data: CreateLuthierDto): Promise<Luthier> {
    const luthier = this.repository.create(data);
    return this.repository.save(luthier);
  }

  async findAll(): Promise<Luthier[]> {
    return this.repository.find({ relations: ['instrumentos'] });
  }

  async findOne(id: number): Promise<Luthier | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['instrumentos'],
    });
  }

  async update(id: number, data: UpdateLuthierDto): Promise<Luthier> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Luthier não encontrado');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const luthier = await this.repository.findOne({ where: { id } });
    return !!luthier;
  }
}
