import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/typeorm.module';
import { LuthierModule } from './modules/luthier/luthier.module';
import { InstrumentoReparoModule } from './modules/instrumento-reparo/instrumento-reparo.module';

@Module({
    imports: [
        DatabaseModule,
        LuthierModule,
        InstrumentoReparoModule,
    ],
})
export class AppModule {}
