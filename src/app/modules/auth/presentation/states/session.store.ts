import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface SessionState {}

@StoreConfig({ name: 'session' })
@Injectable()
export class SessionStore extends Store<SessionState> {
  constructor() {
    super({});
  }
}
