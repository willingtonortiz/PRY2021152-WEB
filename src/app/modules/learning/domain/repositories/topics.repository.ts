import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';
import {
  Area,
  Topic,
  AddTopicType,
  AddTopicResult,
  UpdateTopicType,
  UpdateTopicResult,
} from '../models';

export abstract class TopicsRepository {
  abstract getAllByArea(area: Area): Promise<Either<Failure, Topic[]>>;

  abstract getOneById(topicId: string): Promise<Either<Failure, Topic>>;

  abstract addOne(
    areaId: string,
    topic: AddTopicType
  ): Promise<Either<Failure, AddTopicResult>>;

  abstract updateOne(
    topicId: string,
    topic: UpdateTopicType
  ): Promise<Either<Failure, UpdateTopicResult>>;

  abstract deleteOne(topicId: string): Promise<Either<Failure, boolean>>;
}
