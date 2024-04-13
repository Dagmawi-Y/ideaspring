import { Module } from '@nestjs/common';
import { EngagerController } from './engager.controller';
import { EngagerService } from './engager.service';

@Module({
  controllers: [EngagerController],
  providers: [EngagerService]
})
export class EngagerModule {}
