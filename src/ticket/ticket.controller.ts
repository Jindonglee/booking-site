import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post(':id')
  createTicket(
    @Param('id') id: number,
    @Body() createTicketDto: CreateTicketDto,
    @Request() req: any,
  ) {
    const userId = req.user.user_id;

    if (id !== userId) {
      throw new UnauthorizedException('해당 작업을 수행할 권한이 없습니다.');
    }
    return this.ticketService.create(id, createTicketDto);
  }

  @Get(':id')
  async findAllTicket(@Param('id') id: number) {
    return await this.ticketService.findAll(id);
  }

  @Get('seat/:id')
  async findAllRemainingSeat(@Param('id') id: number) {
    const schedule_id = id;
    return await this.ticketService.findAllRemainingSeat(schedule_id);
  }

  @Delete(':id')
  async cancelTicket(
    @Param('id') id: number,
    @Query('ticket_id') ticket_id: string,
    @Request() req: any,
  ) {
    const userId = req.user.user_id;

    if (id !== userId) {
      throw new UnauthorizedException('해당 작업을 수행할 권한이 없습니다.');
    }
    return await this.ticketService.cancelTicket(id, +ticket_id);
  }
}
