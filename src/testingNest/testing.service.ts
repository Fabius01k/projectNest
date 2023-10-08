import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingService {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async deleteAllData() {
    await this.dataSource.query(`DELETE FROM public."Users"`);
    await this.dataSource.query(`DELETE FROM public."UserSession"`);
    await this.dataSource.query(`DELETE FROM public."Blogs"`);
    await this.dataSource.query(`DELETE FROM public."Posts"`);
    await this.dataSource.query(`DELETE FROM public."Comments"`);
    await this.dataSource.query(
      `DELETE FROM public."CommentsLikesAndDislikes"`,
    );
    await this.dataSource.query(`DELETE FROM public."PostsLikesAndDislikes"`);
  }
}
