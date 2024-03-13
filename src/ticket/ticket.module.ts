import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round_Seat } from './entities/round_seat.entity';
import { Ticket } from './entities/ticket.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Seat } from 'src/performance/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Round_Seat, Schedule, Seat, User]),
    UserModule,
    ScheduleModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
