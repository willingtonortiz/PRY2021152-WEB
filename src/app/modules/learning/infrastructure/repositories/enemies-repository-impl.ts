import { HttpClient } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';
import { environment } from '../../../../../environments/environment';

import { Failure, SessionStorage } from '../../../../core/domain';
import { EnemiesRepository, Enemy } from '../../domain';

const TEMPORAL_ENEMIES: Enemy[] = [
  {
    id: '01',
    name: 'Name 01',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '02',
    name: 'Name 02',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '03',
    name: 'Name 03',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '04',
    name: 'Name 04',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '05',
    name: 'Name 05',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '06',
    name: 'Name 06',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '07',
    name: 'Name 07',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '08',
    name: 'Name 08',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '09',
    name: 'Name 09',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '10',
    name: 'Name 10',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '11',
    name: 'Name 11',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '12',
    name: 'Name 12',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '13',
    name: 'Name 13',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '14',
    name: 'Name 14',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
  {
    id: '15',
    name: 'Name 15',
    imageUrl:
      'https://cdn.discordapp.com/attachments/702353712835723284/872890361545117696/crimson_imp.png',
  },
];

export class EnemiesRepositoryImpl implements EnemiesRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionStorage: SessionStorage
  ) {}

  async getAll(): Promise<Either<Failure, Enemy[]>> {
    try {
      const url = `${environment.baseUrl}/admin/enemies`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<Enemy[]>(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al obtener los enemigos'));
    }
  }

  async getAllUnasigned(): Promise<Either<Failure, Enemy[]>> {
    try {
      const url = `${environment.baseUrl}/admin/enemies?available=${true}`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<Enemy[]>(url, { headers: { Authorization: `Bearer ${token}` } })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al obtener los enemigos'));
    }
  }
}
