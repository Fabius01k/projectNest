import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TopUserView } from './player-statistics.view.model';

export type QuizGameView = {
  id: string;
  firstPlayerProgress: {
    answers:
      | {
          questionId: string;
          answerStatus: string;
          addedAt: string;
        }[]
      | [];
    player: {
      id: string;
      login: string;
    };
    score: number;
  };
  secondPlayerProgress: {
    answers:
      | {
          questionId: string;
          answerStatus: string;
          addedAt: string;
        }[]
      | []
      | null;
    player: {
      id: string | null;
      login: string | null;
    };
    score: number | null;
  } | null;
  questions: { id: string; body: string }[] | null;
  status: string;
  pairCreatedDate: string | null;
  startGameDate: string | null;
  finishGameDate: string | null;
};

export type AnswerView = {
  questionId: string;
  answerStatus: string;
  addedAt: string;
};

export interface GameResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: QuizGameView[];
}
export interface TopUsersResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: TopUserView[];
}
export class QueryDtoModel {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  pageSize: number;
}
