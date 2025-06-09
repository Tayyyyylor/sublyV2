import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV');
        const databaseUrl = config.get<string>('DATABASE_URL');

        console.log('database config values', {
          host: config.get<string>('DATABASE_HOST'),
          port: config.get<string>('DATABASE_PORT'),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
        });
        console.log('NODE_ENV:', process.env.NODE_ENV);
        if (nodeEnv === 'production' && databaseUrl) {
          // Railway (production)
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: {
              rejectUnauthorized: false, // requis pour Railway
            },
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        // Environnement local (Docker, etc.)
        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST'),
          port: parseInt(config.get<string>('DATABASE_PORT') || '5432', 10),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
