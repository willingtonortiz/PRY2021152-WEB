import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, UseCase } from '../../../../core/domain';
import { EquipmentsStore } from '../../presentation';
import {
  AddEquipmentResult,
  AddEquipmentType,
  EquipmentTypes,
} from '../models';
import { EquipmentsRepository } from '../repositories';

interface AddEquipmentParams {
  type: EquipmentTypes;
  equipment: AddEquipmentType;
}

@Injectable()
export class AddEquipmentUseCase
  implements UseCase<AddEquipmentResult, AddEquipmentParams>
{
  constructor(
    private readonly equipmentsRepository: EquipmentsRepository,
    private readonly equipmentsStore: EquipmentsStore
  ) {}

  async execute({
    type,
    equipment,
  }: AddEquipmentParams): Promise<Either<Failure, AddEquipmentResult>> {
    this.equipmentsStore.setLoading(true);

    const either = await this.equipmentsRepository.addOne(type, equipment);

    this.equipmentsStore.setLoading(false);

    // TODO: Add sell price in return
    const { name, description, attack, defense, buyPrice } = equipment;

    return either.ifRight(({ id, imageUrl }) => {
      this.equipmentsStore.add(
        {
          id,
          name,
          description,
          attack,
          defense,
          buyPrice,
          imageUrl,
          sellPrice: Math.round(buyPrice * 0.7),
          isActive: true,
        },
        { prepend: true }
      );
    });
  }
}
