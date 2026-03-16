import { NEW_ID } from '../constants';

export abstract class EntityWithId {
  constructor(public readonly id: string) {}

  public isNew() {
    return this.id === NEW_ID;
  }
}
