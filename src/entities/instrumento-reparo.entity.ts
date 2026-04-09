import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Luthier } from './luthier.entity';

@Entity()
export class InstrumentoReparo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modeloMadeira: string;

  @Column('date')
  dataEntrada: Date;

  @Column({ default: false })
  reparoConcluido: boolean;

  @Column('float')
  custoReparo: number;

  @Column()
  luthierId: number;

  @ManyToOne(() => Luthier, (luthier) => luthier.instrumentos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'luthierId' })
  luthier: Luthier;
}
