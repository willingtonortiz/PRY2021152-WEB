import { HttpClient } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';
import { v4 as uuidv4 } from 'uuid';

import { environment } from '../../../../../environments/environment';
import { Failure, SessionStorage } from '../../../../core/domain';

import {
  AddTopicResult,
  AddTopicType,
  Area,
  Topic,
  TopicsRepository,
  UpdateTopicResult,
  UpdateTopicType,
} from '../../domain';

export class TopicsRepositoryImpl implements TopicsRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionStorage: SessionStorage
  ) {}

  async getAllByArea(area: Area): Promise<Either<Failure, Topic[]>> {
    // TODO: Implement API Call

    const topics: Topic[] = Array.from({ length: 20 }).map((_, i) => {
      const GEOMETRY_IMAGE = 'assets/images/images/geometry.png';

      const id = uuidv4();

      return {
        id: id,
        name: `Tema ${id}`,
        description: `Descripción ${id}`,
        imageUrl: GEOMETRY_IMAGE,
        levels: [],
      };
    });

    return Right(topics);
  }

  async getOneById(topicId: string): Promise<Either<Failure, Topic>> {
    try {
      const url = `${environment.baseUrl}/admin/math/topics/${topicId}`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<Topic>(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Ocurrió un error al eliminar el tema'));
    }
  }

  async addOne(
    areaId: string,
    { name, description, enemyIds, image }: AddTopicType
  ): Promise<Either<Failure, AddTopicResult>> {
    try {
      const url = `${environment.baseUrl}/admin/math/topics`;
      const token = this.sessionStorage.getToken();

      const parsedEnemyIds = enemyIds.join(',');

      const formData = new FormData();
      formData.append('mathAreaId', areaId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('enemyIds', parsedEnemyIds);
      formData.append('image', image);

      const response = await this.httpClient
        .post<AddTopicResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al añadir el tema'));
    }
  }

  async updateOne(
    topicId: string,
    { name, description, enemyIds, image }: UpdateTopicType
  ): Promise<Either<Failure, UpdateTopicResult>> {
    try {
      const url = `${environment.baseUrl}/admin/math/topics/${topicId}`;
      const token = this.sessionStorage.getToken();

      // Conditional update
      const formData = new FormData();
      name && formData.append('name', name);
      description && formData.append('description', description);
      image && formData.append('image', image);

      if (enemyIds !== undefined) {
        const parsedEnemyIds = enemyIds.join(',');
        enemyIds && formData.append('enemyIds', parsedEnemyIds);
      }

      const response = await this.httpClient
        .patch<UpdateTopicResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al editar el tema'));
    }
  }

  async deleteOne(topicId: string): Promise<Either<Failure, boolean>> {
    try {
      const url = `${environment.baseUrl}/admin/math/topics/${topicId}`;
      const token = this.sessionStorage.getToken();

      await this.httpClient
        .delete<void>(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(true);
    } catch (exp) {
      return Left(Failure.from('Ocurrió un error al eliminar el tema'));
    }
  }
}
