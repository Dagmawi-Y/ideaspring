import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('IdeaSpring.')
    .setDescription('API Endpoints for the IdeaSpring web app.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // app.useLogger(['error', 'warn', 'log', 'verbose']);

  app.setGlobalPrefix('api/v1');
  await app.listen(3333);
}
bootstrap();
