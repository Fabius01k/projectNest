import { Controller, Delete, HttpCode, Res } from '@nestjs/common';
import { TestingService } from './testing.service';
import { Response } from 'express';

@Controller('testing')
export class TestingController {
  constructor(private myService: TestingService) {}

  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData(@Res({ passthrough: true }) res: Response) {
    await this.myService.deleteAllData();
    return;
  }
}
