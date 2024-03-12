import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { Performance } from './entities/performance.entity';
import { Seat } from './entities/seat.entity';
import { Schedule } from './entities/schedule.entity';
import { Hall } from './entities/hall.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round_Seat } from './entities/round_seat.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Performance, Seat, Hall, Schedule, Round_Seat]),
    AwsModule,
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
