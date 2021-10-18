import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { EquipmentsRepository } from '..';
import { Failure, UseCase } from '../../../../core/domain';
import { EquipmentsStore } from '../../presentation';

interface DisableEquipmentParams {
  id: string;
}

@Injectable()
export class DisableEquipmentUseCase
  implements UseCase<boolean, DisableEquipmentParams>
{
  constructor(
    private readonly equipmentsRepository: EquipmentsRepository,
    private readonly equipmentsStore: EquipmentsStore
  ) {}

  async execute({
    id,
  }: DisableEquipmentParams): Promise<Either<Failure, boolean>> {
    const either = await this.equipmentsRepository.disableOne(id);

    return either.ifRight((_) => {
      this.equipmentsStore.update(id, { isActive: false });
    });
  }
}
