import { HttpClient } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';

import { environment } from '../../../../environments/environment';
import {
  DifficultyLevel,
  DifficultyLevelsRepository,
  Failure,
  SessionStorage,
} from '../../domain';

const GET_ALL_DEFAULT_ERROR_MESSAGE =
  'Ocurrió un error al obtener las dificultades';

export class DifficultyLevelsRepositoryImpl
  implements DifficultyLevelsRepository
{
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionStorage: SessionStorage
  ) {}

  async getAll(): Promise<Either<Failure, DifficultyLevel[]>> {
    try {
      const url = `${environment.baseUrl}/math/difficulties`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<DifficultyLevel[]>(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from(GET_ALL_DEFAULT_ERROR_MESSAGE));
    }
  }
}
