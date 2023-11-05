import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { QuestionTrm } from './question.entity';
import { PlayerTrm } from './player.entity';

@Entity()
export class QuizGameTrm {
  @PrimaryColumn()
  @Index()
  id: string;
  @Column()
  @Index()
  status: string;
  @Column({ default: null })
  firstPlayerFinishId: string;
  @Column({ default: null })
  pairCreatedDate: string;
  @Column({ default: null })
  startGameDate: string;
  @Column({ default: null })
  finishGameDate: string;
  @Column({ type: 'text', default: [], array: true })
  questionsId: string[];
  @OneToMany(() => QuestionTrm, (q) => q.game)
  gameQuestions: QuestionTrm[];
  @OneToMany(() => PlayerTrm, (p) => p.userId)
  gamePlayers: PlayerTrm[];
}
