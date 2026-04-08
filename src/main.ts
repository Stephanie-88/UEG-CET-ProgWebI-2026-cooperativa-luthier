import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { BusinessExceptionFilter } from './filters/business-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new BusinessExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Cooperativa de Luthiers API')
    .setDescription(
      'API para gerenciamento de luthiers e instrumentos em reparo',
    )
    .setVersion('1.0')
    .addTag('luthiers')
    .addTag('instrumentos-reparo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
