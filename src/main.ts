import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = +configService.getOrThrow<string>('APP_PORT');
  const HOST = configService.getOrThrow<string>('APP_HOST');
  const MODE = configService.getOrThrow<string>('NODE_ENV');

  const isDev = MODE === 'development';

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: configService.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('MD API')
      .setVersion('0.0.1')
      .setDescription('API чтобы делится md файлами в виде web страниц')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(PORT, () => {
    console.log(`API url: http://${HOST}:${PORT}/api`);
    if (isDev) console.log(`SWAGGER url: http://${HOST}:${PORT}/swagger`);
  });
}
bootstrap();
