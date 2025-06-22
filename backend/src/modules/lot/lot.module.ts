import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotResolver } from './lot.resolver';

@Module({
  providers: [LotResolver, LotService],
})
export class LotModule {}
