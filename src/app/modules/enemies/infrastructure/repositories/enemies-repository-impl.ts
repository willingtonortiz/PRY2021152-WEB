import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';

import { environment } from '../../../../../environments/environment';
import { Failure, SessionStorage } from '../../../../core/domain';
import {
  AddEnemyResult,
  AddEnemyType,
  EnemiesRepository,
  Enemy,
  UpdateEnemyResult,
  UpdateEnemyType,
} from '../../domain';

export class EnemiesRepositoryImpl implements EnemiesRepository {
  constructor(
    private httpClient: HttpClient,
    private sessionStorage: SessionStorage
  ) {}

  async getAll(): Promise<Either<Failure, Enemy[]>> {
    try {
      const url = `${environment.baseUrl}/admin/enemies`;
      const token = this.sessionStorage.getToken();

      const result = await this.httpClient
        .get<Enemy[]>(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(result);
    } catch (e) {
      return Left(new Failure('Ocurrió un error al obtener enemigos'));
    }
  }

  async addOne({
    name,
    image,
  }: AddEnemyType): Promise<Either<Failure, AddEnemyResult>> {
    try {
      const url = `${environment.baseUrl}/admin/enemies`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      formData.append('name', name);
      formData.append('enemyImage', image);

      const result = await this.httpClient
        .post<AddEnemyResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(result);
    } catch (e) {
      return Left(new Failure('Ocurrió un error al añadir un enemigo'));
    }
  }

  async updateOne(
    enemyId: string,
    { name, image }: UpdateEnemyType
  ): Promise<Either<Failure, UpdateEnemyResult>> {
    try {
      const url = `${environment.baseUrl}/admin/enemies/${enemyId}`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      name && formData.append('name', name);
      image && formData.append('enemyImage', image);

      const result = await this.httpClient
        .patch<UpdateEnemyResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(result);
    } catch (e) {
      return Left(new Failure('Ocurrió un error al editar el enemigo'));
    }
  }

  async deleteOne(enemyId: string): Promise<Either<Failure, boolean>> {
    try {
      const url = `${environment.baseUrl}/admin/enemy/${enemyId}`;
      const token = this.sessionStorage.getToken();

      await this.httpClient
        .delete(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(true);
    } catch (exception) {
      const { error } = exception as HttpErrorResponse;

      if (
        error &&
        error.errors &&
        error.errors.enemyId &&
        error.errors.enemyId.length > 0
      ) {
        return Left(new Failure(error?.errors?.enemyId[0]));
      }
      return Left(new Failure('Ocurrió un error al eliminar al enemigo'));
    }
  }
}
