import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';
import {
  Problem,
  GetOneProblemResult,
  AddProblemType,
  AddProblemResult,
  UpdateProblemType,
  UpdateProblemResult,
} from '../models';

export abstract class ProblemsRepository {
  abstract getAllByTopic(topicId: string): Promise<Either<Failure, Problem[]>>;

  abstract getOneById(
    problemId: string
  ): Promise<Either<Failure, GetOneProblemResult>>;

  abstract addOne(
    topicId: string,
    problem: AddProblemType
  ): Promise<Either<Failure, AddProblemResult>>;

  abstract updateOne(
    problemId: string,
    problem: UpdateProblemType
  ): Promise<Either<Failure, UpdateProblemResult>>;

  abstract deleteOne(problemId: string): Promise<Either<Failure, boolean>>;
}
