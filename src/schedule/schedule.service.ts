import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async checkScheduleTime(schedule_id: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { schedule_id },
    });
    if (!schedule) {
      throw new NotFoundException('해당하는 스케쥴을 찾을 수 없습니다.');
    }

    const currentDateTime = new Date();
    const scheduleDateTime = new Date(
      `${schedule.schedule_date} ${schedule.start_time}`,
    );
    console.log(schedule.start_time);
    console.log({ 현재시간: currentDateTime });
    console.log({ 시작시간: scheduleDateTime });

    if (currentDateTime > scheduleDateTime) {
      throw new BadRequestException('예약 시간이 이미 지났습니다.');
    }

    // 현재 시간과 스케쥴 시작 시간의 차이 계산 (밀리초 단위)
    const timeDifference = Math.abs(
      currentDateTime.getTime() - scheduleDateTime.getTime(),
    );
    console.log({ 현재시간: currentDateTime.getTime() });
    console.log({ 시작시간: scheduleDateTime.getTime() });

    // 3시간 이상 차이가 나는 경우 오류 반환
    const threeHoursInMillis = 3 * 60 * 60 * 1000;
    if (timeDifference < threeHoursInMillis) {
      throw new BadRequestException(
        '스케쥴 시작 시간이 3시간 이상 차이가 나는 경우에만 해지할 수 있습니다.',
      );
    }
  }

  async checkRemainingSeat(schedule_id: number) {
    const schedule = await this.scheduleRepository.findOneBy({ schedule_id });
    if (schedule.remaining_seat === 0) {
      throw new NotFoundException('좌석이 없습니다!');
    }
    return schedule;
  }

  async plusRemaingSeat(schedule_id: number) {
    const schedule = await this.scheduleRepository.findOneBy({ schedule_id });
    schedule.remaining_seat += 1;
    await this.scheduleRepository.save(schedule);
    return schedule;
  }
  async minusRemaingSeat(schedule_id: number) {
    const schedule = await this.scheduleRepository.findOneBy({ schedule_id });
    schedule.remaining_seat -= 1;
    await this.scheduleRepository.save(schedule);
    return schedule;
  }
}
