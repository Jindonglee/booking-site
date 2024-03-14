import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreatePerformanceDto } from './dto/create-performance.dto';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  async findAll(@Query('orderKey') orderKey: 'created_at' | 'category') {
    return await this.performanceService.findAllOrderBy(orderKey);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.performanceService.findOne(id);
  }

  @Post('search')
  async search(@Body('keyword') keyword: string) {
    if (!keyword) {
      throw new BadRequestException('검색어를 제공해야 합니다.');
    }
    return await this.performanceService.search(keyword);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async createPerformance(@Body() createPerformanceDto: CreatePerformanceDto) {
    // 업로드된 이미지를 사용하여 공연 정보를 생성하는 로직을 작성합니다.
    await this.performanceService.createPerformance(createPerformanceDto);

    return { message: '공연 등록에 성공하셨습니다.' };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.performanceService.uploadImage(image, id);
  }
}
