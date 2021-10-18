import { Injectable } from '@angular/core';
import { Either } from 'purify-ts';

import { Failure, NoParams, UseCase } from '../../../../core/domain';
import { Area } from '../models';
import { AreasRepository } from '../repositories';
import { AreasStore } from '../../presentation';

@Injectable()
export class GetAllAreasUseCase implements UseCase<Area[], NoParams> {
  constructor(
    private readonly areasRepository: AreasRepository,
    private readonly areasStore: AreasStore
  ) {}

  async execute(_: NoParams): Promise<Either<Failure, Area[]>> {
    this.areasStore.setLoading(true);

    const areasEither = await this.areasRepository.getAll();

    this.areasStore.setLoading(false);

    return areasEither.ifRight((areas) => {
      this.areasStore.set(areas);
    });
  }
}
