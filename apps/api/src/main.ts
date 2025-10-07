import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ): void => {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedPatterns = [
        /^https?:\/\/([^.]+\.)?abc\.com$/,
        /^https?:\/\/localhost:\d+$/,
        /^https?:\/\/([^.]+\.)?localhost(:\d+)?$/,
      ];

      const allowed =
        allowedPatterns.some((pattern) => pattern.test(origin)) ||
        ['http://localhost:3000', 'http://localhost:4000'].includes(origin);

      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
