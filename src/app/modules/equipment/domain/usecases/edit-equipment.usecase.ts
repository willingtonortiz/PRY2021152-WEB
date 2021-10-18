import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { EquipmentsStore } from '../../presentation';
import { EditEquipmentResult, EditEquipmentType } from '../models';
import { EquipmentsRepository } from '../repositories';

interface EditEquipmentParams {
  id: string;
  equipment: EditEquipmentType;
}

@Injectable()
export class EditEquipmentUseCase
  implements UseCase<EditEquipmentResult, EditEquipmentParams>
{
  constructor(
    private readonly equipmentsRepository: EquipmentsRepository,
    private readonly equipmentsStore: EquipmentsStore
  ) {}

  async execute({
    id,
    equipment,
  }: EditEquipmentParams): Promise<Either<Failure, EditEquipmentResult>> {
    this.equipmentsStore.setLoading(true);

    const either = await this.equipmentsRepository.updateOne(id, equipment);

    this.equipmentsStore.setLoading(false);

    const { name, description, attack, defense, buyPrice } = equipment;

    return either.ifRight(({ imageUrl }) => {
      this.equipmentsStore.update(id, {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(attack !== undefined && { attack }),
        ...(defense !== undefined && { defense }),
        ...(buyPrice !== undefined && {
          buyPrice,
          sellPrice: Math.round(buyPrice * 0.7),
        }),
        ...(imageUrl !== null && {
          imageUrl: `${imageUrl}?${Date.now()}`,
        }),
      });
    });
  }
}
