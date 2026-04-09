import { Luthier } from '../entities/luthier.entity';
import { CreateLuthierDto, UpdateLuthierDto } from '../dto/luthier.dto';

export interface ILuthierRepository {
  create(data: CreateLuthierDto): Promise<Luthier>;
  findAll(): Promise<Luthier[]>;
  findOne(id: number): Promise<Luthier | null>;
  update(id: number, data: UpdateLuthierDto): Promise<Luthier>;
  remove(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}
