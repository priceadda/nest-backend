import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import defaultConfig from './config/app';
import mongoose from 'mongoose';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
import { CustomValidationPipe } from './common/pipe/cutome-validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const appConfig = defaultConfig();
  app.useGlobalPipes(
    new CustomValidationPipe({ transform: true, stopAtFirstError: true }),
  );
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  const routePrefix = appConfig.api.prefix;
  if (routePrefix) {
    app.setGlobalPrefix(routePrefix);
  }
  mongoose.set('debug', !appConfig.isProduction);

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription(`Auth API Documentation`)
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('Auth')
    // .addTag('Users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (routePrefix) {
    SwaggerModule.setup(`${routePrefix}/docs`, app, document);
  } else {
    SwaggerModule.setup(`docs`, app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
