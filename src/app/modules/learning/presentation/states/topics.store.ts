import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';

import { AreaTopic } from '../../domain';

export interface TopicsState
  extends EntityState<AreaTopic, string>,
    ActiveState {}

@StoreConfig({ name: 'topics' })
@Injectable()
export class TopicsStore extends EntityStore<TopicsState> {
  constructor() {
    super({ loading: false });
  }
}
