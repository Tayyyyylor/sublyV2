import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/event.module';
import { CategoryModule } from './categories/category.module';
import { RecurrenceModule } from './recurrence/recurrence.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    RecurrenceModule,
    EventsModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log(' Database connection established successfully!');
  }
}
