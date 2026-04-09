import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';

@Entity('luthiers')
export class LuthierOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 160 })
    nomeMestre: string;

    @Column('date')
    dataAbertura: Date;

    @Column({ default: false })
    certificada: boolean;

    @Column()
    bancadasNum: number;

    @OneToMany('InstrumentoReparoOrmEntity', 'luthier')
    instrumentos: any[];
}
