import { Module } from '@nestjs/common';
import { PitchController } from './pitch.controller';
import { PitchService } from './pitch.service';

@Module({
  controllers: [PitchController],
  providers: [PitchService]
})
export class PitchModule {}
