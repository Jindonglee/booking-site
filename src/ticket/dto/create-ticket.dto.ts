import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty({ message: '회차 아이디를 입력해 주세요.' })
  schedule_id: number;

  @IsNumber()
  @IsNotEmpty({ message: '좌석을 선택해 주세요' })
  seat_id: number;
}
