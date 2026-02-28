import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app/app.module';
import { requestLoggingMiddleware } from './app/observability/request-logging.middleware';
import { buildSwaggerDocument, swaggerPath } from './app/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(requestLoggingMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:4200';
  app.enableCors({
    origin: frontendOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const document = buildSwaggerDocument(app);
  SwaggerModule.setup(swaggerPath, app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
