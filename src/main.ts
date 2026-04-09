import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './shared/filters/app-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AppExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    const config = new DocumentBuilder()
        .setTitle('Cooperativa de Luthiers API')
        .setDescription('API RESTful para gerenciamento de luthiers e instrumentos em reparo. Arquitetura Hexagonal + SRP.')
        .setVersion('1.0')
        .addTag('Luthiers', 'Operações CRUD para mestres luthiers e suas oficinas')
        .addTag('Instrumentos Reparo', 'Operações CRUD para instrumentos em reparo (FK: luthierId)')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-ui', app, document, {
        jsonDocumentUrl: 'swagger/json',
    });

    await app.listen(process.env.PORT ?? 3000);
    console.log(`🎸 Cooperativa de Luthiers API rodando em: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`📖 Swagger UI disponível em: http://localhost:${process.env.PORT ?? 3000}/swagger-ui`);
}
bootstrap();
