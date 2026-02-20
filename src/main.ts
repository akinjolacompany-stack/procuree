import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestContextInterceptor } from './common/interceptor/requestContext';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://procuree-fe.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // keep only if frontend uses cookies/withCredentials
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
      whitelist: true, // Strip out any properties that are not defined in the DTO.
    }),
  );

  app.useGlobalInterceptors(new RequestContextInterceptor());

  const options = new DocumentBuilder()
    .setTitle('Procuree API')
    .setDescription('Your API description')
    .setVersion('1.0')

    .addTag('Your API Tag')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
