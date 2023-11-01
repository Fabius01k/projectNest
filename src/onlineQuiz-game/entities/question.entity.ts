import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { QuizGameTrm } from './quiz-game.entity';
import { UserAnswersTrm } from './user-answers.entity';

@Entity()
export class QuestionTrm {
  @PrimaryColumn()
  id: string;
  @Column()
  body: string;
  @Column({ type: 'text', default: [], array: true })
  correctAnswers: string[];
  @Column({ default: false })
  published: boolean;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @ManyToOne(() => QuizGameTrm, (q) => q.gameQuestions)
  @JoinColumn({ name: 'gameId' })
  game: QuizGameTrm;
  // @OneToMany(() => UserAnswersTrm, (u) => u.questionId)
  // questionAnswers: UserAnswersTrm[];
}

export interface QuestionResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: QuestionTrm[];
}
