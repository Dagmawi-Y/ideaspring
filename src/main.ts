import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntrepreneurGuard } from './auth/guard/entrepreneur.guard';
import { AdminGuard } from './auth/guard/admin.guard';
import { InvestorGuard } from './auth/guard/investor.guard';
import { EngagerGuard } from './auth/guard/engager.guard';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);

  app.useGlobalGuards(
    new AdminGuard(reflector, prisma),
    new EntrepreneurGuard(reflector, prisma),
    new InvestorGuard(reflector, prisma),
    new EngagerGuard(reflector, prisma),
  );

  const options = new DocumentBuilder()
    .setTitle('Start Good.')
    .setDescription('API Endpoints for the startgood web app.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3333);
}
bootstrap();
