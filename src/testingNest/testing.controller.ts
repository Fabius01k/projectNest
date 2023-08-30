import { Controller, Delete, Res } from '@nestjs/common';
import { TestingService } from './testing.service';
import { Response } from 'express';

@Controller('testing')
export class TestingController {
  constructor(private myService: TestingService) {}

  @Delete('/all-data')
  async deleteAllData(@Res({ passthrough: true }) res: Response) {
    await this.myService.deleteAllData();
    return res.sendStatus(204);
  }
}
