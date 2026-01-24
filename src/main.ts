import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
     whitelist: true,
     transform: true,
    }),
  );

  /* Swagger config */
  const config = new DocumentBuilder()
  .setTitle('NestJS Masterclass API')
  .setDescription('Use the base API URL as http://localhost:3000/')
  .setTermsOfService('https://example.com/terms')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addServer('http://localhost:3000/')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  /* Swagger config end */

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
