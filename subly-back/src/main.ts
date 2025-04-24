import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore les champs inconnus
      forbidNonWhitelisted: true, // rejette les champs non listés dans le DTO
      transform: true, // transforme les types (string -> number etc)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
