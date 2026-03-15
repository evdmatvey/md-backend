import { RoleAssignmentMetadata } from './role-assignment-metadata.entity';

export class RoleAssignmentHistory {
  private readonly _history: RoleAssignmentMetadata[];

  public constructor(history: RoleAssignmentMetadata[]) {
    this._history = history;
  }

  public add(assignment: RoleAssignmentMetadata): void {
    this._history.push(assignment);
  }

  public get history(): readonly RoleAssignmentMetadata[] {
    return Object.freeze([...this._history]);
  }
}
