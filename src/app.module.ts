import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PerformanceModule } from './performance/performance.module';

import { AwsModule } from './aws/aws.module';
import { TicketModule } from './ticket/ticket.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configServce: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configServce.get('DB_USERNAME'),
    password: configServce.get('DB_PASSWORD'),
    host: configServce.get('DB_HOST'),
    port: configServce.get('DB_PORT'),
    database: configServce.get('DB_NAME'),
    entities: [__dirname + '/**/**/*.entity.{js,ts}'],
    synchronize: configServce.get('DB_HOST'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PerformanceModule,
    AwsModule,
    TicketModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
