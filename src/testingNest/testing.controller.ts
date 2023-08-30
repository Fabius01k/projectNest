import { Controller, Delete } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(private myService: TestingService) {}

  @Delete('/all-data')
  async deleteAllData() {
    await this.myService.deleteAllData();
    return 'Data deleted successfully';
  }
}
