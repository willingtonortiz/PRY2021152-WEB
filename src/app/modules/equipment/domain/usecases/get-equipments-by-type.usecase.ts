import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { EquipmentsStore } from '../../presentation/states';
import { Equipment, EquipmentTypes } from '../models';
import { EquipmentsRepository } from '../repositories';

interface GetEquipmentsByTypeParams {
  type: EquipmentTypes;
}

@Injectable()
export class GetEquipmentsByTypeUseCase
  implements UseCase<Equipment[], GetEquipmentsByTypeParams>
{
  constructor(
    private readonly equipmentsRepository: EquipmentsRepository,
    private readonly equipmentsStore: EquipmentsStore
  ) {}

  async execute({
    type,
  }: GetEquipmentsByTypeParams): Promise<Either<Failure, Equipment[]>> {
    this.equipmentsStore.setLoading(true);

    const either = await this.equipmentsRepository.getAllByType(type);

    this.equipmentsStore.setLoading(false);

    return either.ifRight((equipments) => {
      this.equipmentsStore.set(equipments);
      this.equipmentsStore.update({ filter: type });
    });
  }
}
