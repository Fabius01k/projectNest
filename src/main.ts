import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './expection.filter';
import { ValidationError } from 'class-validator';
import { isNil } from '@nestjs/common/utils/shared.utils';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({});
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse: {
          message: string | undefined;
          field: string;
        }[] = [];

        errors.forEach((e: ValidationError) => {
          const constraintsKeys = Object.keys(e.constraints || {}) as string[];
          if (!isNil(e.constraints)) {
            constraintsKeys.forEach((key) => {
              errorsForResponse.push({
                message: e.constraints![key],
                field: e.property,
              });
            });
          }
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  // useContainer(app.use(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
