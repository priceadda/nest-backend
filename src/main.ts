// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

