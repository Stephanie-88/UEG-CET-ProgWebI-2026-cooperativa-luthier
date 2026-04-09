import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { LuthierOrmEntity } from '../../../../luthier/infrastructure/persistence/typeorm/luthier.orm-entity';

@Entity('instrumentos_reparo')
export class InstrumentoReparoOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    modeloMadeira: string;

    @Column('date')
    dataEntrada: Date;

    @Column({ default: false })
    reparoConcluido: boolean;

    @Column('float')
    custoReparo: number;

    @Column()
    luthierId: number;

    @ManyToOne(() => LuthierOrmEntity, (luthier) => luthier.instrumentos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'luthierId' })
    luthier: LuthierOrmEntity;
}
