import { InstrumentoReparo } from '../entities/instrumento-reparo.entity';
import {
  CreateInstrumentoReparoDto,
  UpdateInstrumentoReparoDto,
} from '../dto/instrumento-reparo.dto';

export interface IInstrumentoReparoRepository {
  create(data: CreateInstrumentoReparoDto): Promise<InstrumentoReparo>;
  findAll(): Promise<InstrumentoReparo[]>;
  findOne(id: number): Promise<InstrumentoReparo | null>;
  findByLuthier(luthierId: number): Promise<InstrumentoReparo[]>;
  update(
    id: number,
    data: UpdateInstrumentoReparoDto,
  ): Promise<InstrumentoReparo>;
  remove(id: number): Promise<void>;
  existsByModeloAndLuthier(
    modeloMadeira: string,
    luthierId: number,
    reparoConcluido: boolean,
  ): Promise<boolean>;
}
