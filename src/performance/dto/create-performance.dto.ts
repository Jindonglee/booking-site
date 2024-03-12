import {
  Matches,
  IsDate,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  description: string;

  @IsDateString()
  @IsNotEmpty({ message: '시작 일을 입력해 주세요' })
  start_date: string;

  @IsDateString()
  @IsNotEmpty({ message: '종료 일을 입력해 주세요' })
  end_date: string;

  @IsNumber()
  @IsNotEmpty({ message: '공연 장소id를 입력해주세요' })
  hall_id: number;

  @IsString()
  @IsNotEmpty({ message: '카테고리를 설정해주셔야 합니다.' })
  category: string;

  //   @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$|^24:00$/) // 00:00에서 24:00까지
  //   time: string;
}
