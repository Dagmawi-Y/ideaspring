import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InvestorModule } from './investor/investor.module';
import { StartupModule } from './startup/startup.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { PitchModule } from './pitch/pitch.module';
import { EngagerModule } from './engager/engager.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    InvestorModule,
    StartupModule,
    MessageModule,
    NotificationModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PitchModule,
    EngagerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
