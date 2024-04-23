import { Module } from '@nestjs/common';
import { StartupController } from './startup.controller';
import { StartupService } from './startup.service';
import { InvestorService } from '../investor/investor.service';

@Module({
  controllers: [StartupController],
  providers: [StartupService, InvestorService],
})
export class StartupModule {}
