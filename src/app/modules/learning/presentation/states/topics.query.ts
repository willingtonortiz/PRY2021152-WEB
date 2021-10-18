import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { TopicsState, TopicsStore } from './topics.store';

@Injectable()
export class TopicsQuery extends QueryEntity<TopicsState> {
  selectAllSorted$ = this.selectAll().pipe(
    map((x) => x.sort((a, b) => a.name.localeCompare(b.name)))
  );

  constructor(protected readonly store: TopicsStore) {
    super(store);
  }
}
