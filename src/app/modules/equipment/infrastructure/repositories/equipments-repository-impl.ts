import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Either, Left, Right } from 'purify-ts';

import { environment } from '../../../../../environments/environment';
import { Failure, SessionStorage } from '../../../../core/domain';
import {
  AddEquipmentResult,
  AddEquipmentType,
  EditEquipmentResult,
  EditEquipmentType,
  Equipment,
  EquipmentsRepository,
  EquipmentTypes,
} from '../../domain';

export class EquipmentsRepositoryImpl implements EquipmentsRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionStorage: SessionStorage
  ) {}

  async getAllByType(
    type: EquipmentTypes
  ): Promise<Either<Failure, Equipment[]>> {
    try {
      const url = `${
        environment.baseUrl
      }/admin/equipments?equipmentType=${type.toString()}`;
      const token = this.sessionStorage.getToken();

      const response = await this.httpClient
        .get<Equipment[]>(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(
        Failure.from('Ocurrió un error al obtener los equipamientos')
      );
    }
  }

  async addOne(
    type: EquipmentTypes,
    { name, description, buyPrice, attack, defense, image }: AddEquipmentType
  ): Promise<Either<Failure, AddEquipmentResult>> {
    try {
      const url = `${environment.baseUrl}/admin/equipments`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      formData.append('equipmentType', type.toString());
      formData.append('name', name);
      formData.append('description', description);
      formData.append('buyPrice', `${buyPrice}`);
      formData.append('attack', `${attack}`);
      formData.append('defense', `${defense}`);
      formData.append('image', image);

      const response = await this.httpClient
        .post<AddEquipmentResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al añadir el equipamiento'));
    }
  }

  async updateOne(
    id: string,
    { name, description, attack, defense, buyPrice, image }: EditEquipmentType
  ): Promise<Either<Failure, EditEquipmentResult>> {
    try {
      const url = `${environment.baseUrl}/admin/equipments/${id}`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      name !== undefined && formData.append('name', name);
      description !== undefined && formData.append('description', description);
      buyPrice !== undefined && formData.append('buyPrice', `${buyPrice}`);
      attack !== undefined && formData.append('attack', `${attack}`);
      defense !== undefined && formData.append('defense', `${defense}`);
      image !== undefined && formData.append('image', image);

      const response = await this.httpClient
        .patch<AddEquipmentResult>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(response);
    } catch (exp) {
      return Left(Failure.from('Error al editar el equipamiento'));
    }
  }

  async enableOne(id: string): Promise<Either<Failure, boolean>> {
    try {
      const url = `${environment.baseUrl}/admin/equipments/${id}`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      formData.append('isActive', 'true');

      await this.httpClient
        .patch<void>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(true);
    } catch (exception) {
      const { error } = exception as HttpErrorResponse;

      if (
        error &&
        error.errors &&
        error.errors.equipmentId &&
        error.errors.equipmentId.length > 0
      ) {
        return Left(new Failure(error?.errors?.equipmentId[0]));
      }

      return Left(Failure.from('Ocurrió un error al activar el equipamiento'));
    }
  }

  async disableOne(id: string): Promise<Either<Failure, boolean>> {
    try {
      const url = `${environment.baseUrl}/admin/equipments/${id}`;
      const token = this.sessionStorage.getToken();

      const formData = new FormData();
      formData.append('isActive', 'false');

      await this.httpClient
        .patch<void>(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();

      return Right(true);
    } catch (exception) {
      const { error } = exception as HttpErrorResponse;

      if (
        error &&
        error.errors &&
        error.errors.equipmentId &&
        error.errors.equipmentId.length > 0
      ) {
        return Left(new Failure(error?.errors?.equipmentId[0]));
      }

      return Left(
        Failure.from('Ocurrió un error al desactivar el equipamiento')
      );
    }
  }
}
