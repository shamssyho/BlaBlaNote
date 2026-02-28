import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerPath = 'api/docs';

export function buildSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('BlaBlaNote API')
    .setDescription('BlaBlaNote SaaS API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'bearer'
    )
    .addTag('Auth')
    .addTag('Notes')
    .addTag('Projects')
    .addTag('Tags')
    .addTag('Profile')
    .addTag('Share')
    .addTag('Admin')
    .addTag('Blog')
    .build();

  return SwaggerModule.createDocument(app, config);
}
