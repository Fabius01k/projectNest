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
    await this.dataSource.query(
      `DELETE FROM public."comments_likes_and_dislikes_trm"`,
    );
    await this.dataSource.query(
      `DELETE FROM public."posts_likes_and_dislikes_trm"`,
    );
    await this.dataSource.query(`DELETE FROM public."comment_trm"`);
    await this.dataSource.query(`DELETE FROM public."users_session_trm"`);
    await this.dataSource.query(`DELETE FROM public."user_trm"`);
    await this.dataSource.query(`DELETE FROM public."post_trm"`);
    await this.dataSource.query(`DELETE FROM public."blog_trm"`);
  }
}
