import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { LuthierRepository } from './adapters/luthier.adapter';
import { InstrumentoReparoRepository } from './adapters/instrumento-reparo.adapter';
import { LuthierService } from './services/luthier.service';
import { InstrumentoReparoService } from './services/instrumento-reparo.service';
import { LuthierController } from './controllers/luthier.controller';
import { InstrumentoReparoController } from './controllers/instrumento-reparo.controller';
import { Luthier } from './entities/luthier.entity';
import { InstrumentoReparo } from './entities/instrumento-reparo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Luthier, InstrumentoReparo]),
  ],
  controllers: [LuthierController, InstrumentoReparoController],
  providers: [
    LuthierRepository,
    InstrumentoReparoRepository,
    LuthierService,
    InstrumentoReparoService,
  ],
})
export class AppModule {}
