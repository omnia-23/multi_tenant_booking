import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationExceptionFilter } from './common/filters/validation.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Regular json parser for other routes
  app.use(json({ limit: '10mb' }));

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: errors => {
        const messages = errors
          .map(error => Object.values(error.constraints).map(message => `${error.property} ${message}`))
          .flat();
        return new UnprocessableEntityException(messages);
      },
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors();

  app.setGlobalPrefix('api');

  console.log(`Listening on port ${configService.getOrThrow('PORT')}`);
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
