import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { SessionEntity } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
