import { HttpClient } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';

import { environment } from '../../../../../environments/environment';
import { Failure, SessionStorage } from '../../../../core/domain';
import { Area, AreasRepository } from '../../domain';

export class AreasRepositoryImpl implements AreasRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionStorage: SessionStorage
  ) {}

  async getAll(): Promise<Either<Failure, Area[]>> {
    try {
      const url = `${environment.baseUrl}/admin/math/areas`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<Area[]>(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al obtener las áreas'));
    }
  }
}
