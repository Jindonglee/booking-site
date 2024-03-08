import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '새 비밀번호를 입력해 주세요' })
  newPassword: string;

  @IsString()
  @IsOptional()
  nick_name: string;
}
