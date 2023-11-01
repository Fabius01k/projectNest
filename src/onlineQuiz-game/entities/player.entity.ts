import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { QuizGameTrm } from './quiz-game.entity';

@Entity()
export class PlayerTrm {
  @PrimaryColumn()
  id: string;
  @Index()
  @Column()
  userId: string;
  @Column()
  userLogin: string;
  @Index()
  @Column()
  gameId: string;
  @Column()
  @Index()
  userStatus: string;
  @Column()
  gameStatus: string;
  @Column({ default: 0 })
  scoresNumberInGame: number;
  @ManyToOne(() => QuizGameTrm, (q) => q.gamePlayers)
  @JoinColumn({ name: 'gameId' })
  game: QuizGameTrm;
}
