import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
export class LoginDto extends OmitType(CreateUserDto, ['nick_name']) {}
