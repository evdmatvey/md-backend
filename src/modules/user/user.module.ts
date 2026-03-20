import { Module } from '@nestjs/common';
import { RedisModule } from '../shared/redis';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [],
})
export class UserModule {}
