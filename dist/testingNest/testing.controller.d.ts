import { TestingService } from './testing.service';
export declare class TestingController {
    private myService;
    constructor(myService: TestingService);
    deleteAllData(): Promise<string>;
}
