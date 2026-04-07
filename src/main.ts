import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const bodyLimit = process.env.REQUEST_BODY_LIMIT || '10mb';

  const allowedOrigins = Array.from(
    new Set([
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://eventful-frontend-five.vercel.app/',
      'https://eventful-frontend-heib.vercel.app/',
      ...envOrigins,
    ]),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  app.use(
    bodyParser.json({
      limit: bodyLimit,
      verify: (req: any, _res, buf) => {
        req.rawBody = buf
      }
    })
  )

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: bodyLimit,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Eventful API')
    .setDescription('API documentation for the Eventful platform')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      'access-token',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204,
  })

  const port = process.env.PORT || 4000

  console.log('ENV PORT:', process.env.PORT);
  console.log('Final PORT:', port);
  console.log('Allowed CORS origins:', allowedOrigins);
  console.log('Request body limit:', bodyLimit);
  await app.listen(port, '0.0.0.0');

  console.log(`App running at ${port}`)
}

bootstrap();
