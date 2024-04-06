import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InvestorModule } from './investor/investor.module';
import { StartupModule } from './startup/startup.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SharedModule } from './shared/shared.module';
import { ExternalModule } from './external/external.module';
import { LocalizationModule } from './localization/localization.module';
import { SecurityModule } from './security/security.module';
import { LoggingModule } from './logging/logging.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CacheModule } from './cache/cache.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    InvestorModule,
    StartupModule,
    MessageModule,
    NotificationModule,
    RecommendationModule,
    AnalyticsModule,
    SharedModule,
    PrismaModule,
    ExternalModule,
    LocalizationModule,
    SecurityModule,
    LoggingModule,
    FileUploadModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
