import { HttpClient } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';

import { environment } from '../../../../../environments/environment';
import { Failure, SessionStorage } from '../../../../core/domain';
import {
  AddProblemResult,
  AddProblemType,
  UpdateProblemResult,
  UpdateProblemType,
  GetOneProblemResult,
  Problem,
  ProblemsRepository,
} from '../../domain';

export class ProblemsRepositoryImpl implements ProblemsRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionStorage: SessionStorage
  ) {}

  async getAllByTopic(topicId: string): Promise<Either<Failure, Problem[]>> {
    try {
      const url = `${environment.baseUrl}/admin/math/topics/${topicId}/problems`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<Problem[]>(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al obtener los problemas'));
    }
  }

  async getOneById(
    problemId: string
  ): Promise<Either<Failure, GetOneProblemResult>> {
    try {
      const url = `${environment.baseUrl}/admin/math/problems/${problemId}`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<GetOneProblemResult>(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al obtener los problemas'));
    }
  }

  async addOne(
    topicId: string,
    { difficultyId, answers, description, image }: AddProblemType
  ): Promise<Either<Failure, AddProblemResult>> {
    try {
      const url = `${environment.baseUrl}/admin/math/problems`;
      const token = this.sessionStorage.getToken();

      const answersIsCorrect = answers.map((x) => x.isCorrect).join(',');
      const answersDescriptions = answers.map((x) => x.description).join(',');

      // Required parameters
      const formData = new FormData();
      formData.append('mathTopicId', topicId);
      formData.append('difficultyId', difficultyId);
      formData.append('mathAnswersIsCorrect', answersIsCorrect);
      formData.append('mathAnswersDescription', answersDescriptions);
      // Optional parameters
      description && formData.append('description', description);
      image && formData.append('image', image);

      const response = await this.httpClient
        .post<AddProblemResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Ocurrió un error al añadir el problema'));
    }
  }

  async updateOne(
    problemId: string,
    { difficultyId, description, image, answers }: UpdateProblemType
  ): Promise<Either<Failure, UpdateProblemResult>> {
    try {
      const url = `${environment.baseUrl}/admin/math/problems/${problemId}`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      difficultyId && formData.append('difficultyId', difficultyId);
      description && formData.append('description', description);
      image && formData.append('image', image);
      if (answers !== undefined) {
        const answersId = answers.map((x) => x.id).join(',');
        const answersDescriptions = answers.map((x) => x.description).join(',');
        const answersIsCorrect = answers.map((x) => x.isCorrect).join(',');

        formData.append('mathAnswersId', answersId);
        formData.append('mathAnswersDescription', answersDescriptions);
        formData.append('mathAnswersIsCorrect', answersIsCorrect);
      }

      const response = await this.httpClient
        .patch<AddProblemResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Ocurrió un error al editar el problema'));
    }
  }

  async deleteOne(problemId: string): Promise<Either<Failure, boolean>> {
    try {
      const url = `${environment.baseUrl}/admin/math/problems/${problemId}`;
      const token = this.sessionStorage.getToken();

      await this.httpClient
        .delete<Problem[]>(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(true);
    } catch (exp) {
      return Left(Failure.from('Error al obtener los problemas'));
    }
  }
}
