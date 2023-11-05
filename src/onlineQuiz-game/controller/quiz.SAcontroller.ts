import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { QuestionInputModel } from '../../inputmodels-validation/question.inputModel';
import { QuestionResponse, QuestionTrm } from '../entities/question.entity';
import { CreateQuestionCommand } from '../quiz.use-cases/createQuestion.use-case';
import { DeleteQuestionCommand } from '../quiz.use-cases/deleteQuestion.use-case';
import { UpdateQuestionCommand } from '../quiz.use-cases/updateQuestion.use-case';
import { PublishQuestionCommand } from '../quiz.use-cases/publishQuestion.use-case';
import { GetAllQuestionsCommand } from '../quiz.use-cases/getAllQustions.use-case';
import { GetPublishQuestionsCommand } from '../quiz.use-cases/getPublishQuestions.use-case';
import { QuestionUpdatedInputModel } from '../../inputmodels-validation/question.updatedInputModel';

@Controller('sa')
export class QuizGameSaController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Get('quiz/questions')
  async getAllQuestions(
    @Query('bodySearchTerm') bodySearchTerm: string,
    @Query('publishedStatus')
    publishedStatus: 'all' | 'published' | 'notPublished',
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<QuestionResponse> {
    if (!publishedStatus) {
      publishedStatus = 'all';
    }
    if (publishedStatus === 'published') {
      publishedStatus = 'published';
    }
    if (publishedStatus === 'notPublished') {
      publishedStatus = 'notPublished';
    }
    if (!sortBy) {
      sortBy = 'createdAt';
    }

    if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
      sortDirection = 'desc';
    }

    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }

    if (publishedStatus === 'all') {
      return await this.commandBus.execute(
        new GetAllQuestionsCommand(
          bodySearchTerm,
          sortBy,
          sortDirection,
          pageSize,
          pageNumber,
        ),
      );
    } else {
      return await this.commandBus.execute(
        new GetPublishQuestionsCommand(
          bodySearchTerm,
          publishedStatus,
          sortBy,
          sortDirection,
          pageSize,
          pageNumber,
        ),
      );
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post('quiz/questions')
  async postQuestion(
    @Body() questionDto: QuestionInputModel,
  ): Promise<QuestionTrm> {
    return await this.commandBus.execute(
      new CreateQuestionCommand(questionDto),
    );
  }
  @UseGuards(BasicAuthGuard)
  @Delete('quiz/questions/:id')
  @HttpCode(204)
  async deleteQuestion(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteQuestionCommand(id));

    return;
  }
  @UseGuards(BasicAuthGuard)
  @Put('quiz/questions/:id')
  @HttpCode(204)
  async putQuestion(
    @Param('id') id: string,
    @Body() questionDto: QuestionInputModel,
  ): Promise<boolean> {
    await this.commandBus.execute(new UpdateQuestionCommand(id, questionDto));

    return true;
  }
  @UseGuards(BasicAuthGuard)
  @Put('quiz/questions/:id/publish')
  @HttpCode(204)
  async publishQuestion(
    @Param('id') id: string,
    @Body('published') published: QuestionUpdatedInputModel,
  ): Promise<boolean> {
    await this.commandBus.execute(new PublishQuestionCommand(id, published));

    return true;
  }
}
