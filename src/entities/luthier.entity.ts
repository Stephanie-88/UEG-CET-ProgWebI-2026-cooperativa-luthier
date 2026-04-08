import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InstrumentoReparo } from './instrumento-reparo.entity';

@Entity()
export class Luthier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeMestre: string;

  @Column('date')
  dataAbertura: Date;

  @Column({ default: false })
  certificada: boolean;

  @Column()
  bancadasNum: number;

  @OneToMany(() => InstrumentoReparo, (instrumento) => instrumento.luthier)
  instrumentos: InstrumentoReparo[];
}
