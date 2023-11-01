import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { QuestionTrm } from './question.entity';

@Entity()
export class UserAnswersTrm {
  @PrimaryColumn()
  id: string;
  @Index()
  @Column()
  playerId: string;
  @Column()
  questionId: string;
  @Index()
  @Column()
  answerStatus: string;
  @Column()
  addedAt: string;
  // @ManyToOne(() => QuestionTrm, (q) => q.questionAnswers)
  // @JoinColumn({ name: 'id' })
  // question: QuestionTrm;
}
