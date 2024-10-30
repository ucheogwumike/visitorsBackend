import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded, json } from 'express';
import { join } from 'path';
// import express from 'express';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });
  app.setGlobalPrefix('app');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const corsOption = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentails: true,
  };
  app.enableCors(corsOption);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.use(
  //   '/templates',
  //   express.static(join(__dirname, '..', 'public/templates')),
  // );
  app.engine('hbs', hbs({ extname: 'hbs' }));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
