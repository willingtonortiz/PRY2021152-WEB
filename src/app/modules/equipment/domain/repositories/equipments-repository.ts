import { Either } from 'purify-ts';

import { Failure } from '../../../../core/domain';
import {
  Equipment,
  EquipmentTypes,
  AddEquipmentResult,
  AddEquipmentType,
  EditEquipmentType,
  EditEquipmentResult,
} from '../models';

export abstract class EquipmentsRepository {
  abstract getAllByType(
    type: EquipmentTypes
  ): Promise<Either<Failure, Equipment[]>>;

  abstract addOne(
    type: EquipmentTypes,
    equipment: AddEquipmentType
  ): Promise<Either<Failure, AddEquipmentResult>>;

  abstract updateOne(
    id: string,
    equipment: EditEquipmentType
  ): Promise<Either<Failure, EditEquipmentResult>>;

  abstract enableOne(id: string): Promise<Either<Failure, boolean>>;

  abstract disableOne(id: string): Promise<Either<Failure, boolean>>;
}
