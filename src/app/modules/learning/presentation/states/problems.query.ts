import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { ProblemsState, ProblemsStore } from './problems.store';

@Injectable()
export class ProblemsQuery extends QueryEntity<ProblemsState> {
  selectAllByDifficulty$ = this.selectAll().pipe(
    map((x) => {
      return x.sort(
        (a, b) =>
          this.parseDifficultyToNumber(a.difficulty) -
          this.parseDifficultyToNumber(b.difficulty)
      );
    })
  );

  constructor(protected readonly store: ProblemsStore) {
    super(store);
  }

  private parseDifficultyToNumber(difficulty: string): number {
    if (difficulty === 'Fácil') {
      return 0;
    }
    if (difficulty === 'Intermedio') {
      return 1;
    }
    return 2;
  }
}
