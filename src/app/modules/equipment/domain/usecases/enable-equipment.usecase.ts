import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { EquipmentsRepository } from '..';
import { Failure, UseCase } from '../../../../core/domain';
import { EquipmentsStore } from '../../presentation';

interface EnableEquipmentParams {
  id: string;
}

@Injectable()
export class EnableEquipmentUseCase
  implements UseCase<boolean, EnableEquipmentParams>
{
  constructor(
    private readonly equipmentsRepository: EquipmentsRepository,
    private readonly equipmentsStore: EquipmentsStore
  ) {}

  async execute({
    id,
  }: EnableEquipmentParams): Promise<Either<Failure, boolean>> {
    const either = await this.equipmentsRepository.enableOne(id);

    return either.ifRight((_) => {
      this.equipmentsStore.update(id, { isActive: true });
    });
  }
}
